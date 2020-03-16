/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de & contributors

   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tristan Koch (tristankoch)
     * Christian Boulanger (cboulanger)

************************************************************************ */

/**
 * Tests for qx.io.jsonrpc.transport.Http
 * Based on qx.test.io.request.Xhr
 */
qx.Class.define("qx.test.io.jsonrpc.HttpTransport",
{
  extend : qx.dev.unit.TestCase,

  include : [
    qx.dev.unit.MMock,
    qx.test.io.jsonrpc.MAssert
  ],

  members : {

    setUp() {
      this.sinon = qx.dev.unit.Sinon.getSinon();
      this.setUpRequest();
      this.setUpFakeTransport();
      qx.io.jsonrpc.protocol.Request.resetId();
    },

    setUpRequest: function () {
      this.req && this.req.dispose();
      this.req = new qx.io.request.Xhr();
      this.req.setUrl("url");
    },

    setUpFakeTransport: function () {
      if (this.transport && this.transport.send.restore) {
        return;
      }
      this.transport = this.injectStub(qx.io.request.Xhr.prototype, "_createTransport");
      this.setUpRequest();
    },

    setUpFakeXhr: function () {
      // Not fake transport
      this.getSandbox().restore();
      this.useFakeXMLHttpRequest();
      this.setUpRequest();
    },

    /**
     * Sets up the fake server and instructs it to send the given response(s)
     * @param {String} response The server response to the first request
     */
    setUpFakeServer: function (response) {
      // Not fake transport
      this.getSandbox().restore();
      this.useFakeServer();
      this.setUpRequest();
      this.getServer().respondWith(
        "POST", /.*/,
        [200, {"Content-Type": "application/json; charset=utf-8"}, response]
      );
      this.getServer().autoRespond = true;
    },

    /**
     * Assert that the given exception is thrown on receiving the given result
     * @param {String} response
     * @param {Class|Number} exception If class, the exception class, which must
     * be a subclass of qx.io.Exception. If number, the error number
     */
    assertExceptionThrown: function (response, exception) {
      if (!(qx.lang.Type.isNumber(exception) || qx.Class.isSubClassOf(exception, qx.io.Exception))) {
        throw new Error("Second argument must be a Number or a subclass of qx.io.Exception");
      }
      this.setUpFakeServer(response);
      const message_out = new qx.io.jsonrpc.protocol.Request("foo",[1,2,3]);
      const client = new qx.io.jsonrpc.Client("http://jsonrpc");
      const errorCallback = this.spy(err => {
        //console.warn(err);
        if (qx.lang.Type.isNumber(exception)) {
          if (!(err instanceof qx.io.Exception)) {
            throw err;
          }
          this.assertEquals(exception, err.code,`Error code does not match`);
        } else {
          this.assertInstance(err, exception,
            `Exception class does not match. Expected ${exception.classname}, got ${err}.`);
        }
      });
      // check message promise
      message_out.getPromise().catch(errorCallback);
      // check event
      client.addListener("error", evt => errorCallback(evt.getData()));
      // check transport promise
      client.send(message_out).catch(errorCallback);
      this.wait(100, () => {
        if (
          // the request promise will not be called since the promise is already rejected
          exception === qx.io.jsonrpc.exception.Transport.DUPLICATE_ID
          // or the send promise will not be rejected because we have a server-side error
          || exception === qx.io.jsonrpc.exception.JsonRpc) {
          this.assertCalledTwice(errorCallback)
        } else {
          // the error handler will be called three times
          this.assertCalledThrice(errorCallback)
        }
      });
    },

    tearDown: function () {
      this.getSandbox().restore();
      this.req.dispose();
    },

    resetId(){
      qx.io.jsonrpc.protocol.Request.resetId();
    },

    //
    // Auth, should be moved into qx.test.io.request.Xhr
    //

    "test: Bearer authentication": function () {
      this.setUpFakeTransport();

      var transport = this.transport, auth, call, key, credentials;

      auth = new qx.io.request.authentication.Bearer("TOKEN");
      this.req.setAuthentication(auth);
      this.req.send();

      call = transport.setRequestHeader.getCall(1);
      key = "Authorization";
      credentials = /Bearer\s(.*)/.exec(call.args[1])[1];
      this.assertEquals(key, call.args[0]);
      this.assertEquals("TOKEN", credentials);
    },

    //
    // JSON-RPC
    //

    "test: throw on invalid response id" : function() {
      this.resetId();
      var response = qx.lang.Json.stringify({"jsonrpc": "2.0", "result": 19, "id": 2});
      this.assertExceptionThrown(response, qx.io.jsonrpc.exception.Transport.UNKNOWN_ID);
    },

    "test: throw on duplicate response id" : function() {
      this.resetId();
      var response = qx.lang.Json.stringify([
        {"jsonrpc": "2.0", "result": 19, "id": 1},
        {"jsonrpc": "2.0", "result": 19, "id": 1}
      ]);
      this.assertExceptionThrown(response, qx.io.jsonrpc.exception.Transport.DUPLICATE_ID);
    },

    "test: call jsonrpc method and receive response with single result" : async function() {
      this.resetId();
      let message_out = new qx.io.jsonrpc.protocol.Request("foo", ["bar"]);
      let result = "Hello World!";
      let message_in  = new qx.io.jsonrpc.protocol.Result(message_out.getId(), result);
      this.setUpFakeServer(message_in.toString());
      const client = new qx.io.jsonrpc.Client("http://jsonrpc");
      let spy = this.spy(value => this.assertEquals(result, value));
      message_out.getPromise().then(spy);
      await client.send(message_out);
      this.assertCalled(spy);
    },

    "test: call jsonrpc method and receive batched response" : async function() {
      this.resetId();
      let message_out = new qx.io.jsonrpc.protocol.Request("foo", ["bar"]);
      let result = "Hello World!";
      let response = (new qx.io.jsonrpc.protocol.Batch())
        .add(new qx.io.jsonrpc.protocol.Result(message_out.getId(), result))
        .addRequest("foo", ["bar"])
        .addNotification("logout")
        .toString();
      this.setUpFakeServer(response);
      const client = new qx.io.jsonrpc.Client("http://jsonrpc");
      let spy = this.spy(value => this.assertEquals(result, value));
      message_out.getPromise().then(spy);
      await client.send(message_out);
      this.assertCalled(spy);
    },

    "test: call jsonrpc method and expect error on invalid reponse "() {
      this.assertExceptionThrown("helloworld!", qx.io.jsonrpc.exception.Transport.INVALID_JSON);
    },

    "test: call jsonrpc method and expect error on invalid reponse - missing result" () {
      this.assertExceptionThrown("null", qx.io.jsonrpc.exception.Transport.NO_DATA);
    },

    "test: call jsonrpc method and expect error response"() {
      this.resetId();
      var response = qx.lang.Json.stringify({"jsonrpc": "2.0", "error" : {"code": -32600, "message": "Division by zero!"}, "id": 1});
      this.assertExceptionThrown(response, qx.io.jsonrpc.exception.JsonRpc);
    },

    "test: send batched requests"() {
      this.resetId();
      var response = qx.lang.Json.stringify([
        {"jsonrpc": "2.0", "result": 7, "id": 1},
        {"jsonrpc": "2.0", "result": "foo", "id": 2},
        {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": 3},
        {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": 4},
        {"jsonrpc": "2.0", "result": ["hello", 5], "id": 5}]);
      this.setUpFakeServer(response);
      var client = new qx.io.jsonrpc.Client("http://jsonrpc");
      var spies = [];
      var batch = new qx.io.jsonrpc.protocol.Batch();
      for( var i=1; i < 6; i++) {
        spies[i] = { result: this.spy(), error: this.spy() };
        let request = new qx.io.jsonrpc.protocol.Request("someMethod", []);
        request.getPromise()
          .then(spies[i].result)
          .catch(spies[i].error);
        batch.add(request);
      }
      client.sendBatch(batch).catch(err => {
        this.assertInstance(err, qx.io.jsonrpc.exception.JsonRpc);
      });
      this.wait(100, function(){
        this.assertCalledWith(spies[1].result, 7);
        this.assertCalledWith(spies[2].result, "foo");
        this.assertCalled(spies[3].error);
        this.assertCalled(spies[4].error);
        this.assertCalledWith(spies[5].result, ["hello", 5]);
      },this);
    },

    "test: receive jsonrpc requests from server" : function() {
      this.resetId();
      var response = [
        {"jsonrpc": "2.0", "method": "clientMethod", "params": ["foo", "bar"], "id": 1},
        {"jsonrpc": "2.0", "method": "clientNotification", "params": []}
      ];
      this.setUpFakeServer(qx.lang.Json.stringify(response));
      var client = new qx.io.jsonrpc.Client("http://jsonrpc");
      var spy = this.spy();
      client.addListener("peerRequest", (evt) => {
        let message = evt.getData().toObject();
        this.assertDeepEqual(response.shift(), message);
        spy(message);
      });
      client.sendNotification("ping");
      this.wait(100, function(){
        this.assertCalledTwice(spy);
      },this);
    }
  }
});
