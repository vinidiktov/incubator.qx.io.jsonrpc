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
      "qx.test.io.MRemoteTest": {
        "require": true
      },
      "qx.test.Part": {},
      "qx.test.io.part.MockLoader": {},
      "qx.Part": {},
      "qx.io.part.Part": {},
      "qx.test.io.part.MockPackage": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
  qooxdoo - the new era of web development
  
  http://qooxdoo.org
  
  Copyright:
    2007-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
  License:
       MIT: https://opensource.org/licenses/MIT
    See the LICENSE file in the project's top-level directory for details.
  
  Authors:
    * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /* ************************************************************************
  
  
  ************************************************************************ */

  /**
   *
   * @asset(qx/test/*)
   */
  qx.Class.define("qx.test.io.part.Part", {
    extend: qx.dev.unit.TestCase,
    include: qx.test.io.MRemoteTest,
    members: {
      __loader__P_253_0: null,
      setUp: function setUp() {
        qx.test.Part.LOAD_ORDER = [];
        this.__dummyLoader__P_253_1 = new qx.test.io.part.MockLoader();
        this.__loader__P_253_0 = new qx.Part(this.__dummyLoader__P_253_1);
        qx.Part.$$instance = this.__loader__P_253_0;
      },
      tearDown: function tearDown() {
        this.__loader__P_253_0 = null;
        qx.Part.$$instance = undefined;
      },
      createPart: function createPart(name, pkgs, loader) {
        return new qx.io.part.Part(name, pkgs, loader);
      },
      "test: load part with one package": function testLoadPartWithOnePackage() {
        var pkg = new qx.test.io.part.MockPackage("1");
        var part = this.createPart("1", [pkg], this.__loader__P_253_0);
        this.assertEquals("initialized", part.getReadyState());
        var self = this;
        part.load(function (readyState) {
          self.resume(function () {
            self.assertEquals("complete", readyState);
            self.assertEquals("complete", part.getReadyState());
          });
        });
        this.assertEquals("loading", part.getReadyState());
        this.wait();
      },
      "test: load part with several packages": function testLoadPartWithSeveralPackages() {
        var packages = [new qx.test.io.part.MockPackage("a"), new qx.test.io.part.MockPackage("b"), new qx.test.io.part.MockPackage("c")];
        var part = this.createPart("1", packages, this.__loader__P_253_0);
        var self = this;
        part.load(function (readyState) {
          self.resume(function () {
            self.assertJsonEquals(["a", "b", "c"], qx.test.Part.LOAD_ORDER);
          });
        });
        this.wait();
      },
      "test: delay loading of second package should preserve order": function testDelayLoadingOfSecondPackageShouldPreserveOrder() {
        var packages = [new qx.test.io.part.MockPackage("a"), new qx.test.io.part.MockPackage("b", 100), new qx.test.io.part.MockPackage("c")];
        var part = this.createPart("1", packages, this.__loader__P_253_0);
        var self = this;
        part.load(function (readyState) {
          self.resume(function () {
            self.assertJsonEquals(["a", "b", "c"], qx.test.Part.LOAD_ORDER);
          });
        });
        this.wait();
      },
      "test: one already loaded package should not be loaded again and preserve order": function testOneAlreadyLoadedPackageShouldNotBeLoadedAgainAndPreserveOrder() {
        var packages = [new qx.test.io.part.MockPackage("a", 0, false, "complete"), new qx.test.io.part.MockPackage("b"), new qx.test.io.part.MockPackage("c")]; // fail if it is loaded again

        var self = this;
        var oldLoadPackage = this.__loader__P_253_0.loadPackage;

        this.__loader__P_253_0.loadPackage = function (pkg) {
          if (pkg == packages[0]) {
            self.fail();
          } else {
            oldLoadPackage.call(this, pkg);
          }
        };

        var part = this.createPart("1", packages, this.__loader__P_253_0);
        var self = this;
        part.load(function (readyState) {
          self.resume(function () {
            self.assertJsonEquals(["b", "c"], // a is already loaded
            qx.test.Part.LOAD_ORDER);
          });
        });
        this.wait();
      },
      "test: a currently loading package should not be loaded again and should preserve order": function testACurrentlyLoadingPackageShouldNotBeLoadedAgainAndShouldPreserveOrder() {
        var packages = [new qx.test.io.part.MockPackage("a", 0, false, "complete"), new qx.test.io.part.MockPackage("b"), new qx.test.io.part.MockPackage("c")];
        packages[1].load(this.__loader__P_253_0.notifyPackageResult, this.__loader__P_253_0); // now in loading state

        var part = this.createPart("1", packages, this.__loader__P_253_0);
        var self = this;
        part.load(function (readyState) {
          self.resume(function () {
            self.assertJsonEquals(["b", "c"], // a has already been loaded
            qx.test.Part.LOAD_ORDER);
          });
        });
        this.wait();
      },
      "test: error loading second package should set 'error' status on callback": function testErrorLoadingSecondPackageShouldSetErrorStatusOnCallback() {
        var packages = [new qx.test.io.part.MockPackage("a"), new qx.test.io.part.MockPackage("b", 0, true), new qx.test.io.part.MockPackage("c")];
        var part = this.createPart("1", packages, this.__loader__P_253_0);
        var self = this;
        part.load(function (readyState) {
          self.resume(function () {
            this.assertEquals("error", readyState);
            this.assertEquals("error", part.getReadyState());
          });
        });
        this.wait();
      },
      "test: loading a loaded part again should not reload the packages": function testLoadingALoadedPartAgainShouldNotReloadThePackages() {
        var packages = [new qx.test.io.part.MockPackage("a"), new qx.test.io.part.MockPackage("b"), new qx.test.io.part.MockPackage("c")];
        var part = this.createPart("1", packages, this.__loader__P_253_0);
        var self = this;
        part.load(function (readyState) {
          self.__loader__P_253_0.loadPackage = function () {
            self.fail();
          };

          part.load(function (readyState) {
            self.resume(function () {
              this.assertEquals("complete", readyState);
            });
          });
        });
        this.wait();
      },
      "test: loading an error part again should not reload the packages": function testLoadingAnErrorPartAgainShouldNotReloadThePackages() {
        var packages = [new qx.test.io.part.MockPackage("a"), new qx.test.io.part.MockPackage("b", 0, true), new qx.test.io.part.MockPackage("c")];
        var part = this.createPart("1", packages, this.__loader__P_253_0);
        var self = this;
        part.load(function (readyState) {
          self.__loader__P_253_0.loadPackage = function () {
            self.fail();
          };

          part.load(function (readyState) {
            self.resume(function () {
              self.assertEquals("error", readyState);
            });
          });
        });
        this.wait();
      },
      "test: load part with several packages including wrapped": function testLoadPartWithSeveralPackagesIncludingWrapped() {
        var packages = [new qx.test.io.part.MockPackage("a", null, null, null, true), new qx.test.io.part.MockPackage("b"), new qx.test.io.part.MockPackage("c", null, null, null, true)];

        this.__loader__P_253_0.addToPackage(packages[0]);

        this.__loader__P_253_0.addToPackage(packages[1]);

        this.__loader__P_253_0.addToPackage(packages[2]);

        var part = this.createPart("1", packages, this.__loader__P_253_0);
        var self = this;
        part.load(function (readyState) {
          self.resume(function () {
            self.assertJsonEquals(["a", "b", "c"], qx.test.Part.LOAD_ORDER);
          });
        });
        this.wait();
      }
    }
  });
  qx.test.io.part.Part.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Part.js.map?dt=1591362980825