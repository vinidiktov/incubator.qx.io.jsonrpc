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
      "qx.event.Utils": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2018 Zenesis Ltd, john.spackman@zenesis.com
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * John Spackman (johnspackman)
  
   ************************************************************************ */

  /**
   * @ignore(qx.Promise)
   */
  qx.Class.define("qx.test.event.Utils", {
    extend: qx.dev.unit.TestCase,
    members: {
      testQxPromiseNotDefined: function testQxPromiseNotDefined() {
        {
          this.assertTrue(true);
        }
      },
      testNoPromises: function testNoPromises() {
        var Utils = qx.event.Utils;
        var tracker = {};
        var str = "";
        var self = this;
        var finished = false;
        Utils.catch(tracker, function () {
          self.assertTrue(false);
        });
        Utils.then(tracker, function () {
          return str += "A";
        });
        Utils.then(tracker, function (value) {
          self.assertEquals("A", value);
          return str += "B";
        });
        Utils.then(tracker, function () {
          str += "C";
        });
        Utils.then(tracker, function () {
          self.assertEquals("ABC", str);
          finished = true;
        });
        this.assertTrue(finished);
      },
      testSomeDelayedPromises: function testSomeDelayedPromises() {
        {
          var Utils = qx.event.Utils;
          var tracker = {};
          var str = "";
          var self = this;
          Utils.then(tracker, function () {
            str += "A";
          });
          Utils.then(tracker, function () {
            return new qx.Promise(function (resolve) {
              setTimeout(function () {
                str += "B";
                resolve(str);
              }, 200);
            });
          });
          Utils.then(tracker, function (value) {
            self.assertEquals("AB", value);
            str += "C";
          });
          Utils.then(tracker, function () {
            self.assertEquals("ABC", str);
            self.resume();
          });
          self.wait();
        }
      },
      testSomeInstantPromises: function testSomeInstantPromises() {
        {
          var Utils = qx.event.Utils;
          var tracker = {};
          var str = "";
          var self = this;
          Utils.then(tracker, function () {
            str += "A";
          });
          Utils.then(tracker, function () {
            str += "B";
            return qx.Promise.resolve(str);
          });
          Utils.then(tracker, function (value) {
            self.assertEquals("AB", value);
            str += "C";
          });
          Utils.then(tracker, function () {
            self.assertEquals("ABC", str);
            self.resume();
          });
          self.wait();
        }
      },
      testSomeInstantPromises2: function testSomeInstantPromises2() {
        {
          var Utils = qx.event.Utils;
          var tracker = {};
          var str = "";
          var self = this;
          Utils.then(tracker, function () {
            str += "A";
          });
          Utils.then(tracker, function () {
            str += "B";
            return qx.Promise.resolve();
          });
          Utils.then(tracker, function () {
            return new qx.Promise(function (resolve) {
              setTimeout(function () {
                str += "C";
                resolve(str);
              }, 200);
            });
          });
          Utils.then(tracker, function (value) {
            self.assertEquals("ABC", value);
            self.assertEquals("ABC", str);
            self.resume();
          });
          self.wait();
        }
      },
      testSomeAbort: function testSomeAbort() {
        var Utils = qx.event.Utils;
        var tracker = {};
        var str = "";
        var self = this;
        var finished = false;
        Utils.then(tracker, function () {
          str += "A";
        });
        Utils.then(tracker, function () {
          return Utils.ABORT;
        });
        Utils.then(tracker, function () {
          str += "C";
        });
        Utils.then(tracker, function () {
          self.assertTrue(false);
        });
        Utils.catch(tracker, function () {
          self.assertEquals("A", str);
          finished = true;
        });
        this.assertTrue(finished);
      },
      testSomeReject: function testSomeReject() {
        {
          var Utils = qx.event.Utils;
          var tracker = {};
          var str = "";
          var self = this;
          Utils.then(tracker, function () {
            str += "A";
          });
          Utils.then(tracker, function () {
            return new qx.Promise(function (resolve, reject) {
              setTimeout(function () {
                reject();
              }, 200);
            });
          });
          Utils.then(tracker, function () {
            str += "C";
          });
          Utils.then(tracker, function () {
            self.assertTrue(false);
          });
          Utils.catch(tracker, function () {
            self.assertEquals("A", str);
            self.resume();
          });
          self.wait();
        }
      },
      testResolveAndReject: function testResolveAndReject() {
        {
          var Utils = qx.event.Utils;
          var tracker = {};
          var str = "";
          var self = this;
          Utils.then(tracker, function () {
            str += "A";
          });
          Utils.then(tracker, function () {
            return new qx.Promise(function (resolve) {
              setTimeout(function () {
                str += "B";
                resolve();
              }, 200);
            });
          });
          Utils.then(tracker, function () {
            return new qx.Promise(function (resolve, reject) {
              setTimeout(function () {
                reject();
              }, 200);
            });
          });
          Utils.then(tracker, function () {
            self.assertTrue(false);
          });
          Utils.catch(tracker, function () {
            self.assertEquals("AB", str);
            self.resume();
          });
          self.wait();
        }
      },
      testSeries1: function testSeries1() {
        {
          var Utils = qx.event.Utils;
          var tracker = {};
          var str = "";
          var self = this;
          Utils.catch(tracker, function () {
            self.assertTrue(false);
          });
          Utils.then(tracker, function () {
            return Utils.series(["A", "B", "C", "D"], function (value) {
              if (value === "C") {
                return new qx.Promise(function (resolve, reject) {
                  setTimeout(function () {
                    str += value;
                    resolve();
                  }, 200);
                });
              } else {
                str += value;
                return null;
              }
            });
          });
          Utils.then(tracker, function () {
            self.assertEquals("ABCD", str);
            self.resume();
            return null;
          });
          self.wait();
        }
      },
      testSeriesAbort: function testSeriesAbort() {
        {
          var Utils = qx.event.Utils;
          var tracker = {};
          var str = "";
          var self = this;
          Utils.catch(tracker, function () {
            self.assertEquals("AB", str);
            self.resume();
          });
          Utils.then(tracker, function () {
            return Utils.series(["A", "B", "C", "D"], function (value) {
              if (value === "B") {
                return new qx.Promise(function (resolve, reject) {
                  setTimeout(function () {
                    str += value;
                    resolve();
                  }, 200);
                });
              } else if (value === "C") {
                return Utils.ABORT;
              } else {
                str += value;
                return null;
              }
            });
          });
          Utils.then(tracker, function () {
            self.assertTrue(false);
          });
          self.wait();
        }
      },

      /**
       * @ignore(Promise)
       */
      testNativePromiseReturns: function testNativePromiseReturns() {
        if (Promise !== undefined) {
          var self = this;
          var p = new Promise(function (resolve) {
            setTimeout(resolve, 100);
          });
          p = p.then(function () {
            var p2 = new Promise(function (resolve) {
              setTimeout(resolve, 100);
            });
            return p2.then(function () {
              return true;
            });
          });
          p = p.then(function () {
            self.resume();
          });
          this.wait();
        } else {
          this.skip("Skipping because native Promise is not defined");
        }
      },
      testPromiseReturns: function testPromiseReturns() {
        {
          var self = this;
          var p = new qx.Promise(function (resolve) {
            setTimeout(function () {
              console.log("testPromiseReturns:: resolving p");
              resolve();
            }, 100);
          });
          p = p.then(function () {
            var p2 = new qx.Promise(function (resolve) {
              setTimeout(function () {
                console.log("testPromiseReturns:: resolving p2");
                resolve();
              }, 100);
            });
            return p2.then(function () {
              console.log("testPromiseReturns:: resolving post p2");
            });
          });
          p = p.then(function () {
            console.log("testPromiseReturns:: outer then, resuming test");
            self.resume();
          });
          this.wait();
        }
      },
      testSeriesReject: function testSeriesReject() {
        {
          var Utils = qx.event.Utils;
          var tracker = {};
          var str = "";
          var self = this;
          Utils.catch(tracker, function () {
            self.assertEquals("AB", str);
            self.resume();
          });
          Utils.then(tracker, function () {
            return Utils.series(["A", "B", "C", "D"], function (value) {
              if (value === "C") {
                return new qx.Promise(function (resolve, reject) {
                  setTimeout(function () {
                    reject();
                  }, 200);
                });
              } else {
                str += value;
                return null;
              }
            });
          });
          Utils.then(tracker, function () {
            self.assertTrue(false);
          });
          self.wait();
        }
      },
      testSeriesRejectNested: function testSeriesRejectNested() {
        {
          var Utils = qx.event.Utils;
          var tracker = {};
          var str = "";
          var self = this;
          Utils.catch(tracker, function () {
            self.assertEquals("ABC1", str);
            self.resume();
          });
          Utils.then(tracker, function () {
            return Utils.series(["A", "B", "C", "D"], function (letter) {
              if (letter === "C") {
                str += letter;
                return Utils.series([1, 2, 3, 4], function (number) {
                  if (number == 2) {
                    return new qx.Promise(function (resolve, reject) {
                      setTimeout(function () {
                        reject();
                      }, 200);
                    });
                  } else {
                    str += number;
                  }

                  return null;
                });
              } else {
                str += letter;
                return null;
              }
            });
          });
          Utils.then(tracker, function () {
            self.assertTrue(false);
            return null;
          });
          self.wait();
        }
      },
      testSeriesNested: function testSeriesNested() {
        {
          var Utils = qx.event.Utils;
          var tracker = {};
          var str = "";
          var self = this;
          Utils.catch(tracker, function () {
            self.assertTrue(false);
          });
          Utils.then(tracker, function () {
            return Utils.series(["A", "B", "C", "D"], function (letter) {
              if (letter === "C") {
                str += letter;
                return Utils.series([1, 2, 3, 4], function (number) {
                  if (number == 2) {
                    return new qx.Promise(function (resolve, reject) {
                      setTimeout(function () {
                        str += number;
                        resolve();
                      }, 200);
                    });
                  } else {
                    str += number;
                  }

                  return null;
                });
              } else {
                str += letter;
                return null;
              }
            });
          });
          Utils.then(tracker, function () {
            self.assertEquals("ABC1234D", str);
            self.resume();
            return null;
          });
          self.wait();
        }
      },
      testTrack: function testTrack() {
        {
          var Utils = qx.event.Utils;
          var str = "";
          var self = this;
          var finished = true;

          function outer() {
            var tracker = {};
            Utils.track(tracker, inner);
            Utils.then(tracker, function () {
              self.assertEquals("ABC", str);
              finished = true;
            });
            self.assertTrue(finished);
          }

          function add(ch, delay) {
            return function () {
              return new qx.Promise(function (resolve) {
                setTimeout(function () {
                  str += ch;
                  resolve();
                }, 300);
              });
            };
          }

          function inner() {
            var tracker = {};
            Utils.then(tracker, add("A", 300));
            Utils.then(tracker, add("B", 200));
            Utils.then(tracker, add("C", 100));
            return tracker.promise;
          }

          outer();
        }
      }
    }
  });
  qx.test.event.Utils.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Utils.js.map?dt=1600461097801