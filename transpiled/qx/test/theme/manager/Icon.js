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
      "qx.theme.manager.Icon": {},
      "qx.test.Theme": {},
      "qx.Theme": {},
      "qx.util.AliasManager": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */
  qx.Class.define("qx.test.theme.manager.Icon", {
    extend: qx.dev.unit.TestCase,
    members: {
      setUp: function setUp() {
        this.manager = qx.theme.manager.Icon.getInstance();
        this.__formerTheme__P_270_0 = this.manager.getTheme();
      },
      tearDown: function tearDown() {
        qx.test.Theme.themes = null;
        this.manager.setTheme(this.__formerTheme__P_270_0);
        this.__formerTheme__P_270_0 = null;
      },
      testAlias: function testAlias() {
        qx.Theme.define("qx.test.Theme.themes.A", {
          aliases: {
            icon: "test/icon",
            custom: "test/custom"
          }
        });
        this.manager.setTheme(qx.test.Theme.themes.A); // make sure the icon alias is set

        var alias = qx.util.AliasManager.getInstance();
        this.assertEquals("test/icon", alias.resolve("icon"));
        this.assertEquals("test/custom", alias.resolve("custom"));
      },
      testAliasExtend: function testAliasExtend() {
        qx.Theme.define("qx.test.Theme.themes.A", {
          aliases: {
            icon: "test/icon",
            custom: "test/custom"
          }
        });
        qx.Theme.define("qx.test.Theme.themes.B", {
          extend: qx.test.Theme.themes.A
        });
        this.manager.setTheme(qx.test.Theme.themes.B); // make sure the icon alias is set

        var alias = qx.util.AliasManager.getInstance();
        this.assertEquals("test/icon", alias.resolve("icon"));
        this.assertEquals("test/custom", alias.resolve("custom"));
      },
      testAliasOverride: function testAliasOverride() {
        qx.Theme.define("qx.test.Theme.themes.A", {
          aliases: {
            icon: "test/icon",
            custom: "test/custom"
          }
        });
        qx.Theme.define("qx.test.Theme.themes.B", {
          extend: qx.test.Theme.themes.A,
          aliases: {
            icon: "juhu/icon"
          }
        });
        this.manager.setTheme(qx.test.Theme.themes.B); // make sure the icon alias is set

        var alias = qx.util.AliasManager.getInstance();
        this.assertEquals("juhu/icon", alias.resolve("icon"));
        this.assertEquals("test/custom", alias.resolve("custom"));
      },
      testChangeThemeEventFired: function testChangeThemeEventFired() {
        qx.Theme.define("qx.test.Theme.themes.A", {
          aliases: {
            "icon": "my/icon/Theme"
          }
        });
        var that = this;
        this.assertEventFired(this.manager, "changeTheme", function () {
          that.manager.setTheme(qx.test.Theme.themes.A);
        }, function (e) {
          that.assertIdentical(e.getData(), qx.test.Theme.themes.A, "Setting theme failed!");
        });
      }
    }
  });
  qx.test.theme.manager.Icon.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Icon.js.map?dt=1599343225122