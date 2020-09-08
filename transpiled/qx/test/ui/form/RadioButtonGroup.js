(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.test.ui.LayoutTestCase": {
        "require": true
      },
      "qx.ui.form.RadioButtonGroup": {},
      "qx.ui.form.RadioButton": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
   qooxdoo - the new era of web development
  
   http://qooxdoo.org
  
   Copyright:
   2004-2014 1&1 Internet AG, Germany, http://www.1und1.de
  
   License:
       MIT: https://opensource.org/licenses/MIT
   See the LICENSE file in the project's top-level directory for details.
  
   Authors:
   * Tobias Oberrauch <tobias.oberrauch@1und1.de>
  
   ************************************************************************ */
  qx.Class.define("qx.test.ui.form.RadioButtonGroup", {
    extend: qx.test.ui.LayoutTestCase,
    members: {
      setUp: function setUp() {
        this.__radioButtonGroup__P_310_0 = new qx.ui.form.RadioButtonGroup();
        this.__radioButtons__P_310_1 = [];
        var radioButton;

        for (var i = 0, j = 10; i < j; i++) {
          radioButton = new qx.ui.form.RadioButton("option " + i);
          radioButton.setModel("option" + i);

          this.__radioButtons__P_310_1.push(radioButton);

          this.__radioButtonGroup__P_310_0.add(radioButton);
        }
      },
      tearDown: function tearDown() {
        qx.test.ui.form.RadioButtonGroup.prototype.tearDown.base.call(this);

        this.__radioButtonGroup__P_310_0.removeAll();

        this.__radioButtons__P_310_1 = null;
      },
      testRemoveAll: function testRemoveAll() {
        this.__radioButtonGroup__P_310_0.removeAll();

        var amountOfRadioButtons = this.__radioButtonGroup__P_310_0.getRadioGroup().getItems().length;

        this.assertEquals(0, amountOfRadioButtons, "There are still some radio buttons left.");
      }
    }
  });
  qx.test.ui.form.RadioButtonGroup.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=RadioButtonGroup.js.map?dt=1599546983655