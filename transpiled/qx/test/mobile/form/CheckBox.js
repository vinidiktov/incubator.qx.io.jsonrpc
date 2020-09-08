(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.test.mobile.MobileTestCase": {
        "require": true
      },
      "qx.ui.mobile.form.CheckBox": {},
      "qx.bom.element.Class": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Tino Butz (tbtz)
  
  ************************************************************************ */
  qx.Class.define("qx.test.mobile.form.CheckBox", {
    extend: qx.test.mobile.MobileTestCase,
    members: {
      testValue: function testValue() {
        var checkBox = new qx.ui.mobile.form.CheckBox(false);
        this.getRoot().add(checkBox);
        this.assertEquals(false, checkBox.getValue());
        this.assertEquals(false, qxWeb(checkBox.getContainerElement()).hasClass("checked"));
        checkBox.setValue(true);
        this.assertEquals(true, checkBox.getValue());
        this.assertEquals(true, qxWeb(checkBox.getContainerElement()).hasClass("checked"));
        checkBox.destroy();
      },
      testEnabled: function testEnabled() {
        var checkBox = new qx.ui.mobile.form.CheckBox();
        this.getRoot().add(checkBox);
        checkBox.setEnabled(false);
        this.assertEquals(false, checkBox.getEnabled());
        this.assertEquals(true, qx.bom.element.Class.has(checkBox.getContainerElement(), 'disabled'));
        checkBox.destroy();
      }
    }
  });
  qx.test.mobile.form.CheckBox.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=CheckBox.js.map?dt=1599546980198