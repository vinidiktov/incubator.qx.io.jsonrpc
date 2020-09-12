(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.test.log.fixture.ClassB2": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Class.define("qx.test.log.fixture.ClassC2", {
    extend: qx.test.log.fixture.ClassB2,
    members: {
      _applyOldProperty: function _applyOldProperty() {
        qx.test.log.fixture.ClassC2.prototype._applyOldProperty.base.call(this);

        this._callCountApplyOldProperty++;
      },
      _applyNewProperty: function _applyNewProperty() {
        qx.test.log.fixture.ClassC2.prototype._applyNewProperty.base.call(this);

        this._callCountApplyNewProperty++;
      }
    }
  });
  qx.test.log.fixture.ClassC2.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=ClassC2.js.map?dt=1599905731263