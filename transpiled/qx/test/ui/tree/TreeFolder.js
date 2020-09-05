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
      "qx.ui.tree.Tree": {},
      "qx.ui.tree.TreeFolder": {},
      "qx.util.PropertyUtil": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2010 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Tristan Koch (tristankoch)
  
  ************************************************************************ */

  /**
   *
   * @asset(qx/icon/Oxygen/22/emotes/*)
   */
  qx.Class.define("qx.test.ui.tree.TreeFolder", {
    extend: qx.test.ui.LayoutTestCase,
    members: {
      icon_closed: "qx/icon/Oxygen/22/emotes/face-plain.png",
      icon_opened: "qx/icon/Oxygen/22/emotes/face-smile.png",
      __tree__P_335_0: null,
      __root__P_335_1: null,
      __aa__P_335_2: null,
      __ab__P_335_3: null,
      __item__P_335_4: null,
      setUp: function setUp() {
        // Build tree that looks like this:
        //
        // A ("root")
        // - AA ("item")
        // - BB
        var tree = this.__tree__P_335_0 = new qx.ui.tree.Tree();
        var root = this.__root__P_335_1 = new qx.ui.tree.TreeFolder("A");
        tree.setRoot(root);
        root.setOpen(true);
        var aa = this.__aa__P_335_2 = new qx.ui.tree.TreeFolder("AA");
        var ab = this.__ab__P_335_3 = new qx.ui.tree.TreeFolder("AB");
        root.add(aa, ab); // Reference to "aa" as "item"

        this.__item__P_335_4 = this.__aa__P_335_2; // Render to set theme values

        this.getRoot().add(tree);
        this.flush();
      },
      //
      // Icon for when "closed" with all variations of "icon" and "iconClosed" property
      //
      testIconWhenClosed: function testIconWhenClosed() {
        var item = this.__item__P_335_4;
        this.flush();

        this.__assertIcon__P_335_5(item, this.__themeValueIcon__P_335_6(item));
      },
      testIconWhenClosedWithIcon: function testIconWhenClosedWithIcon() {
        var item = this.__item__P_335_4;
        item.setIcon(this.icon_closed);
        this.flush();

        this.__assertIcon__P_335_5(item, this.icon_closed);
      },
      testIconWhenClosedWithIconOpened: function testIconWhenClosedWithIconOpened() {
        var item = this.__item__P_335_4;
        item.setIconOpened(this.icon_opened);
        this.flush();

        this.__assertIcon__P_335_5(item, this.__themeValueIcon__P_335_6(item));
      },
      testIconWhenClosedWithIconAndIconOpened: function testIconWhenClosedWithIconAndIconOpened() {
        var item = this.__item__P_335_4;
        item.setIcon(this.icon_closed);
        item.setIconOpened(this.icon_opened);
        this.flush();

        this.__assertIcon__P_335_5(item, this.icon_closed);
      },
      //
      // Icon when "opened" with all variations of "icon" and "iconClosed" property
      //
      testIconWhenOpened: function testIconWhenOpened() {
        var item = this.__item__P_335_4;
        item.setOpen(true);
        this.flush();

        this.__assertIcon__P_335_5(item, this.__themeValueIconOpened__P_335_7(item));
      },
      testIconWhenOpenedWithIcon: function testIconWhenOpenedWithIcon() {
        var item = this.__item__P_335_4;
        item.setOpen(true);
        item.setIcon(this.icon_closed);
        this.flush(); // At first thought, you probably think this is correct...
        //
        // Expect theme value of iconOpened
        // this.__assertIcon(item, this.__themeValueIconOpened(item));
        // ... however, to ensure backwards-compatibility with the old behaviour
        //     before the property "openIcon" was introduced
        //
        // Expect user-defined value of property "icon"

        this.__assertIcon__P_335_5(item, this.icon_closed);
      },
      testIconWhenOpenedWithIconOpened: function testIconWhenOpenedWithIconOpened() {
        var item = this.__item__P_335_4;
        item.setOpen(true);
        item.setIconOpened(this.icon_opened);
        this.flush();

        this.__assertIcon__P_335_5(item, this.icon_opened);
      },
      testIconWhenOpenedWithIconAndIconOpened: function testIconWhenOpenedWithIconAndIconOpened() {
        var item = this.__item__P_335_4;
        item.setOpen(true);
        item.setIcon(this.icon_closed);
        item.setIconOpened(this.icon_opened);
        this.flush();

        this.__assertIcon__P_335_5(item, this.icon_opened);
      },
      //
      // Icon when "opened", then "closed" with all variations of "icon" and
      // "iconClosed" property
      //
      testIconWhenOpenedThenClosed: function testIconWhenOpenedThenClosed() {
        var item = this.__item__P_335_4;
        item.setOpen(true);
        item.setOpen(false);
        this.flush();

        this.__assertIcon__P_335_5(item, this.__themeValueIcon__P_335_6(item));
      },
      testIconWhenOpenedThenClosedWithIcon: function testIconWhenOpenedThenClosedWithIcon() {
        var item = this.__item__P_335_4;
        item.setIcon(this.icon_closed);
        item.setOpen(true);
        item.setOpen(false);
        this.flush();

        this.__assertIcon__P_335_5(item, this.icon_closed);
      },
      testIconWhenOpenedThenClosedWithIconOpened: function testIconWhenOpenedThenClosedWithIconOpened() {
        var item = this.__item__P_335_4;
        item.setIconOpened(this.icon_closed);
        item.setOpen(true);
        item.setOpen(false);
        this.flush();

        this.__assertIcon__P_335_5(item, this.__themeValueIcon__P_335_6(item));
      },
      testIconWhenOpenedThenClosedWithIconAndIconOpened: function testIconWhenOpenedThenClosedWithIconAndIconOpened() {
        var item = this.__item__P_335_4;
        item.setIcon(this.icon_closed);
        item.setIconOpened(this.icon_opened);
        item.setOpen(true);
        item.setOpen(false);
        this.flush();

        this.__assertIcon__P_335_5(item, this.icon_closed);
      },
      //
      // Icon when "closed", then "opened" with all variations of "icon" and
      // "iconClosed" property
      //
      testIconWhenClosedThenOpened: function testIconWhenClosedThenOpened() {
        var item = this.__item__P_335_4;
        item.setOpen(false);
        item.setOpen(true);
        this.flush();

        this.__assertIcon__P_335_5(item, this.__themeValueIconOpened__P_335_7(item));
      },
      testIconWhenClosedThenOpenedWithIcon: function testIconWhenClosedThenOpenedWithIcon() {
        var item = this.__item__P_335_4;
        item.setIcon(this.icon_closed);
        item.setOpen(false);
        item.setOpen(true);
        this.flush(); // At first thought, you probably think this is correct...
        //
        // Expect theme value of iconOpened
        // this.__assertIcon(item, this.__themeValueIconOpened(item));
        // ... however, to ensure backwards-compatibility with the old behaviour
        //     before the property "openIcon" was introduced
        //
        // Expect user-defined value of property "icon"

        this.__assertIcon__P_335_5(item, this.icon_closed);
      },
      testIconWhenClosedThenOpenedWithIconOpened: function testIconWhenClosedThenOpenedWithIconOpened() {
        var item = this.__item__P_335_4;
        item.setIconOpened(this.icon_opened);
        item.setOpen(false);
        item.setOpen(true);
        this.flush();

        this.__assertIcon__P_335_5(item, this.icon_opened);
      },
      testIconWhenClosedThenOpenedWithIconAndIconOpened: function testIconWhenClosedThenOpenedWithIconAndIconOpened() {
        var item = this.__item__P_335_4;
        item.setIcon(this.icon_closed);
        item.setIconOpened(this.icon_opened);
        item.setOpen(false);
        item.setOpen(true);
        this.flush();

        this.__assertIcon__P_335_5(item, this.icon_opened);
      },
      testRemoveAll: function testRemoveAll() {
        var removed = this.__root__P_335_1.removeAll();

        this.assertEquals(2, removed.length);
        this.assertEquals(this.__aa__P_335_2, removed[0]);
        this.assertEquals(this.__ab__P_335_3, removed[1]);
      },
      //
      // Helper methods
      //
      __themeValueIcon__P_335_6: function __themeValueIcon__P_335_6(item) {
        return qx.util.PropertyUtil.getThemeValue(item, "icon");
      },
      __themeValueIconOpened__P_335_7: function __themeValueIconOpened__P_335_7(item) {
        return qx.util.PropertyUtil.getThemeValue(item, "iconOpened");
      },
      __assertIcon__P_335_5: function __assertIcon__P_335_5(item, expected) {
        this.assertEquals(expected, item.getChildControl("icon").getSource(), "Unexpected source for icon child control");
      },
      tearDown: function tearDown() {
        qx.test.ui.tree.TreeFolder.prototype.tearDown.base.call(this);

        this.__tree__P_335_0.destroy();

        this.__root__P_335_1.destroy();

        this.__aa__P_335_2.destroy();

        this.__ab__P_335_3.destroy();
      }
    }
  });
  qx.test.ui.tree.TreeFolder.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=TreeFolder.js.map?dt=1599343229163