(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /**
   * Abstract class for JSON-RPC transports
   *
   * For the moment, any special configuration of the transport, such as
   * authentication, must be done on the level of the underlying implementation,
   * an abstract API will be added later.
   */
  qx.Class.define("qx.io.jsonrpc.transport.Abstract", {
    extend: qx.core.Object,
    type: "abstract",
    properties: {
      /**
       * The uri of the endpoint
       */
      endpoint: {
        check: "String",
        event: "changeEndpoint"
      }
    },
    events: {
      /**
       * Event fired when a message is received from the endpoint. Event data
       * is an UTF-8 encoded string
       */
      "message": "qx.event.type.Data"
    },

    /**
     * Constructor
     * @param {String} endpoint
     */
    construct(endpoint) {
      qx.core.Object.constructor.call(this);
      this.setEndpoint(endpoint);
    }

  });
  qx.io.jsonrpc.transport.Abstract.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Abstract.js.map?dt=1592866007582