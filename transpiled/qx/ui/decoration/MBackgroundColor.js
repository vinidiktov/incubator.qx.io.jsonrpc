(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.theme.manager.Color": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.theme": {}
      }
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Mixin responsible for setting the background color of a widget.
   * This mixin is usually used by {@link qx.ui.decoration.Decorator}.
   */
  qx.Mixin.define("qx.ui.decoration.MBackgroundColor", {
    properties: {
      /** Color of the background */
      backgroundColor: {
        check: "Color",
        nullable: true,
        apply: "_applyBackgroundColor"
      }
    },
    members: {
      /**
       * Adds the background-color styles to the given map
       * @param styles {Map} CSS style map
       */
      _styleBackgroundColor: function _styleBackgroundColor(styles) {
        var bgcolor = this.getBackgroundColor();

        if (bgcolor && qx.core.Environment.get("qx.theme")) {
          bgcolor = qx.theme.manager.Color.getInstance().resolve(bgcolor);
        }

        if (bgcolor) {
          styles["background-color"] = bgcolor;
        }
      },
      // property apply
      _applyBackgroundColor: function _applyBackgroundColor() {
        {
          if (this._isInitialized()) {
            throw new Error("This decorator is already in-use. Modification is not possible anymore!");
          }
        }
      }
    }
  });
  qx.ui.decoration.MBackgroundColor.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MBackgroundColor.js.map?dt=1591362995803