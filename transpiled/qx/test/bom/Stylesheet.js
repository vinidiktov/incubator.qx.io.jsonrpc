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
      "qx.bom.Stylesheet": {},
      "qx.util.ResourceManager": {},
      "qx.core.AssertionError": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2007-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Daniel Wagner (d_wagner)
  
  ************************************************************************ */

  /* ************************************************************************
  ************************************************************************ */

  /**
   *
   * @asset(qx/test/style.css)
   */
  qx.Class.define("qx.test.bom.Stylesheet", {
    extend: qx.dev.unit.TestCase,
    members: {
      tearDown: function tearDown() {
        if (this.__sheet__P_216_0) {
          var ownerNode = this.__sheet__P_216_0.ownerNode || this.__sheet__P_216_0.owningNode;

          if (ownerNode && ownerNode.parentNode) {
            ownerNode.parentNode.removeChild(ownerNode);
          } else {
            qx.bom.Stylesheet.removeAllRules(this.__sheet__P_216_0);
          }
        }
      },
      testAddImport: function testAddImport() {
        var sheet = this.__sheet__P_216_0 = qx.bom.Stylesheet.createElement();
        var uri = qx.util.ResourceManager.getInstance().toUri("qx/test/style.css");
        qx.bom.Stylesheet.addImport(sheet, uri);

        if (sheet.cssRules) {
          var rules = sheet.cssRules || sheet.rules;
          this.assertEquals(1, sheet.cssRules.length);
          this.assertNotUndefined(sheet.cssRules[0].href);
        } else if (sheet.cssText) {
          this.assertMatch(sheet.cssText, /@import/);
        }

        qx.bom.Stylesheet.removeImport(sheet, uri);
      },
      testAddRule: function testAddRule() {
        var sheet = this.__sheet__P_216_0 = qx.bom.Stylesheet.createElement();
        qx.bom.Stylesheet.addRule(sheet, "#foo", "color: red;");
        var rules = sheet.cssRules || sheet.rules;
        this.assertEquals(1, rules.length);
        this.assertEquals("#foo", rules[0].selectorText);
        {
          this.assertException(function () {
            qx.bom.Stylesheet.addRule(sheet, "#foo", "{color: red;}");
          }, qx.core.AssertionError);
        }
      },
      testCreateElement: function testCreateElement() {
        var sheet = this.__sheet__P_216_0 = qx.bom.Stylesheet.createElement();
        var rules = sheet.cssRules || sheet.rules;
        this.assertNotUndefined(rules, "Created element is not a stylesheet!");
        this.assertEquals(0, rules.length);
      },
      testCreateElementWithText: function testCreateElementWithText() {
        var cssText = "#foo { color: red; }";
        var sheet = this.__sheet__P_216_0 = qx.bom.Stylesheet.createElement(cssText);
        var rules = sheet.cssRules || sheet.rules;
        this.assertNotUndefined(rules, "Created element is not a stylesheet!");
        this.assertEquals(1, rules.length);
        this.assertEquals("#foo", rules[0].selectorText);
      },
      testIncludeFile: function testIncludeFile() {
        var uri = qx.util.ResourceManager.getInstance().toUri("qx/test/style.css");
        qx.bom.Stylesheet.includeFile(uri);
        var linkElems = document.getElementsByTagName("link");
        var found = false;

        for (var i = 0, l = linkElems.length; i < l; i++) {
          if (linkElems[i].href.match(/test\/style\.css/)) {
            found = true;
            break;
          }
        }

        this.assert(found, "Link element was not added to the document!");
      },
      testRemoveAllImports: function testRemoveAllImports() {
        var sheet = this.__sheet__P_216_0 = qx.bom.Stylesheet.createElement();
        var uri = qx.util.ResourceManager.getInstance().toUri("qx/test/style.css");
        qx.bom.Stylesheet.addImport(sheet, uri);
        qx.bom.Stylesheet.addImport(sheet, uri);
        qx.bom.Stylesheet.removeAllImports(sheet);

        if (sheet.cssRules) {
          var rules = sheet.cssRules || sheet.rules;
          this.assertEquals(0, sheet.cssRules.length);
        } else if (typeof sheet.cssText == "string") {
          this.assertEquals("", sheet.cssText);
        }
      },
      testRemoveAllRules: function testRemoveAllRules() {
        var sheet = this.__sheet__P_216_0 = qx.bom.Stylesheet.createElement();
        qx.bom.Stylesheet.addRule(sheet, "#foo", "color: red;");
        qx.bom.Stylesheet.addRule(sheet, "#bar", "color: blue;");
        var rules = sheet.cssRules || sheet.rules;
        this.assertEquals(2, rules.length);
        qx.bom.Stylesheet.removeAllRules(sheet);
        rules = sheet.cssRules || sheet.rules;
        this.assertEquals(0, rules.length);
      },
      testRemoveImport: function testRemoveImport() {
        var sheet = this.__sheet__P_216_0 = qx.bom.Stylesheet.createElement();
        var uri = qx.util.ResourceManager.getInstance().toUri("qx/test/style.css");
        qx.bom.Stylesheet.addImport(sheet, uri);
        qx.bom.Stylesheet.removeImport(sheet, uri);

        if (sheet.cssRules) {
          var rules = sheet.cssRules || sheet.rules;
          this.assertEquals(0, sheet.cssRules.length);
        } else if (typeof sheet.cssText == "string") {
          this.assertEquals("", sheet.cssText);
        }
      },
      testRemoveRule: function testRemoveRule() {
        var sheet = this.__sheet__P_216_0 = qx.bom.Stylesheet.createElement("#foo { color: red; }");
        qx.bom.Stylesheet.removeRule(sheet, "#foo");
        var rules = sheet.cssRules || sheet.rules;
        this.assertEquals(0, rules.length);
      }
    }
  });
  qx.test.bom.Stylesheet.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Stylesheet.js.map?dt=1599905724940