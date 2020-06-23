(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.dev.unit.TestCase": {
        "construct": true,
        "require": true
      },
      "qx.util.LibraryManager": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2007-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */
  qx.Class.define("qx.test.util.LibraryManager", {
    extend: qx.dev.unit.TestCase,
    construct: function construct() {
      qx.dev.unit.TestCase.constructor.call(this);
      this.__mgr__P_356_0 = qx.util.LibraryManager.getInstance();
      this.libKeys = ["sourceUri", "resourceUri"];
      this.__qxBackup__P_356_1 = {};

      for (var key in qx.$$libraries.qx) {
        if (qx.$$libraries.qx.hasOwnProperty(key)) {
          this.__qxBackup__P_356_1[key] = qx.$$libraries.qx[key];
        }
      }
    },
    members: {
      __mgr__P_356_0: null,
      __qxBackup__P_356_1: null,
      libKeys: null,
      testHas: function testHas() {
        this.assert(this.__mgr__P_356_0.has("qx"));
        this.assertFalse(this.__mgr__P_356_0.has("foo"));
      },
      testGet: function testGet() {
        for (var i = 0, l = this.libKeys.length; i < l; i++) {
          var key = this.libKeys[i];
          this.assertEquals(qx.$$libraries.qx[key], this.__mgr__P_356_0.get("qx", key));
        }
      },
      testSet: function testSet() {
        for (var i = 0, l = this.libKeys.length; i < l; i++) {
          var key = this.libKeys[i];

          this.__mgr__P_356_0.set("qx", key, "foo");

          this.assertEquals("foo", qx.$$libraries.qx[key]);
        }
      },
      tearDownTestSet: function tearDownTestSet() {
        for (var key in this.__qxBackup__P_356_1) {
          qx.$$libraries.qx[key] = this.__qxBackup__P_356_1[key];
        }
      }
    }
  });
  qx.test.util.LibraryManager.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=LibraryManager.js.map?dt=1592908588701