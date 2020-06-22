(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.dev.unit.TestCase": {
        "require": true
      },
      "qx.event.type.Event": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2010 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */
  qx.Class.define("qx.test.event.type.Event", {
    extend: qx.dev.unit.TestCase,
    members: {
      "test: stop() should prevent default and stop propagation": function testStopShouldPreventDefaultAndStopPropagation() {
        var e = new qx.event.type.Event().init(true, true);
        this.assertFalse(e.getPropagationStopped());
        this.assertFalse(e.getDefaultPrevented());
        e.stop();
        this.assertTrue(e.getPropagationStopped());
        this.assertTrue(e.getDefaultPrevented());
        e.dispose();
      },
      "test: stop() cannot prevent default on non cancelable events": function testStopCannotPreventDefaultOnNonCancelableEvents() {
        var e = new qx.event.type.Event().init(true, false);
        this.assertFalse(e.getDefaultPrevented());
        e.stop();
        this.assertFalse(e.getDefaultPrevented());
        e.dispose();
      },
      "test: stop() cannot stop propagation on a non bubbling event": function testStopCannotStopPropagationOnANonBubblingEvent() {
        var e = new qx.event.type.Event().init(false, true);
        this.assertFalse(e.getPropagationStopped());
        e.stop();
        this.assertFalse(e.getPropagationStopped());
        e.dispose();
      }
    }
  });
  qx.test.event.type.Event.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Event.js.map?dt=1592866017420