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
      "qx.ui.mobile.page.Manager": {},
      "qx.ui.mobile.page.NavigationPage": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Tino Butz (tbtz)
  
  ************************************************************************ */
  qx.Class.define("qx.test.mobile.page.Manager", {
    extend: qx.test.mobile.MobileTestCase,
    members: {
      testCreate: function testCreate() {
        var manager = new qx.ui.mobile.page.Manager();
        manager.dispose();
      },
      testAddTablet: function testAddTablet() {
        var manager = new qx.ui.mobile.page.Manager(true);
        var page = new qx.ui.mobile.page.NavigationPage();
        manager.addMaster([page]);
        manager.addDetail([page]);
        manager.dispose();
      },
      testAddMobile: function testAddMobile() {
        var manager = new qx.ui.mobile.page.Manager(false);
        var page1 = new qx.ui.mobile.page.NavigationPage();
        var page2 = new qx.ui.mobile.page.NavigationPage();
        manager.addMaster([page1]);
        manager.addMaster([page2]);
        manager.dispose();
      }
    }
  });
  qx.test.mobile.page.Manager.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Manager.js.map?dt=1599546980615