(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.lang.Object": {},
      "qx.bom.client.OperatingSystem": {},
      "qx.event.Timer": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "os.name": {
          "className": "qx.bom.client.OperatingSystem"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * Generic selection manager to bring rich desktop like selection behavior
   * to widgets and low-level interactive controls.
   *
   * The selection handling supports both Shift and Ctrl/Meta modifies like
   * known from native applications.
   */
  qx.Class.define("qx.ui.core.selection.Abstract", {
    type: "abstract",
    extend: qx.core.Object,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */
    construct: function construct() {
      qx.core.Object.constructor.call(this); // {Map} Internal selection storage

      this.__selection__P_402_0 = {};
    },

    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */
    events: {
      /** Fires after the selection was modified. Contains the selection under the data property. */
      "changeSelection": "qx.event.type.Data"
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /**
       * Selects the selection mode to use.
       *
       * * single: One or no element is selected
       * * multi: Multi items could be selected. Also allows empty selections.
       * * additive: Easy Web-2.0 selection mode. Allows multiple selections without modifier keys.
       * * one: If possible always exactly one item is selected
       */
      mode: {
        check: ["single", "multi", "additive", "one"],
        init: "single",
        apply: "_applyMode"
      },

      /**
       * Enable drag selection (multi selection of items through
       * dragging the pointer in pressed states).
       *
       * Only possible for the modes <code>multi</code> and <code>additive</code>
       */
      drag: {
        check: "Boolean",
        init: false
      },

      /**
       * Enable quick selection mode, where no tap is needed to change the selection.
       *
       * Only possible for the modes <code>single</code> and <code>one</code>.
       */
      quick: {
        check: "Boolean",
        init: false
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members: {
      __scrollStepX__P_402_1: 0,
      __scrollStepY__P_402_2: 0,
      __scrollTimer__P_402_3: null,
      __frameScroll__P_402_4: null,
      __lastRelX__P_402_5: null,
      __lastRelY__P_402_6: null,
      __frameLocation__P_402_7: null,
      __dragStartX__P_402_8: null,
      __dragStartY__P_402_9: null,
      __inCapture__P_402_10: null,
      __pointerX__P_402_11: null,
      __pointerY__P_402_12: null,
      __moveDirectionX__P_402_13: null,
      __moveDirectionY__P_402_14: null,
      __selectionModified__P_402_15: null,
      __selectionContext__P_402_16: null,
      __leadItem__P_402_17: null,
      __selection__P_402_0: null,
      __anchorItem__P_402_18: null,
      __pointerDownOnSelected__P_402_19: null,
      // A flag that signals an user interaction, which means the selection change
      // was triggered by pointer or keyboard [BUG #3344]
      _userInteraction: false,
      __oldScrollTop__P_402_20: null,

      /*
      ---------------------------------------------------------------------------
        USER APIS
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the selection context. One of <code>tap</code>,
       * <code>quick</code>, <code>drag</code> or <code>key</code> or
       * <code>null</code>.
       *
       * @return {String} One of <code>tap</code>, <code>quick</code>,
       *    <code>drag</code> or <code>key</code> or <code>null</code>
       */
      getSelectionContext: function getSelectionContext() {
        return this.__selectionContext__P_402_16;
      },

      /**
       * Selects all items of the managed object.
       *
       */
      selectAll: function selectAll() {
        var mode = this.getMode();

        if (mode == "single" || mode == "one") {
          throw new Error("Can not select all items in selection mode: " + mode);
        }

        this._selectAllItems();

        this._fireChange();
      },

      /**
       * Selects the given item. Replaces current selection
       * completely with the new item.
       *
       * Use {@link #addItem} instead if you want to add new
       * items to an existing selection.
       *
       * @param item {Object} Any valid item
       */
      selectItem: function selectItem(item) {
        this._setSelectedItem(item);

        var mode = this.getMode();

        if (mode !== "single" && mode !== "one") {
          this._setLeadItem(item);

          this._setAnchorItem(item);
        }

        this._scrollItemIntoView(item);

        this._fireChange();
      },

      /**
       * Adds the given item to the existing selection.
       *
       * Use {@link #selectItem} instead if you want to replace
       * the current selection.
       *
       * @param item {Object} Any valid item
       */
      addItem: function addItem(item) {
        var mode = this.getMode();

        if (mode === "single" || mode === "one") {
          this._setSelectedItem(item);
        } else {
          if (this._getAnchorItem() == null) {
            this._setAnchorItem(item);
          }

          this._setLeadItem(item);

          this._addToSelection(item);
        }

        this._scrollItemIntoView(item);

        this._fireChange();
      },

      /**
       * Removes the given item from the selection.
       *
       * Use {@link #clearSelection} when you want to clear
       * the whole selection at once.
       *
       * @param item {Object} Any valid item
       */
      removeItem: function removeItem(item) {
        this._removeFromSelection(item);

        if (this.getMode() === "one" && this.isSelectionEmpty()) {
          var selected = this._applyDefaultSelection(); // Do not fire any event in this case.


          if (selected == item) {
            return;
          }
        }

        if (this.getLeadItem() == item) {
          this._setLeadItem(null);
        }

        if (this._getAnchorItem() == item) {
          this._setAnchorItem(null);
        }

        this._fireChange();
      },

      /**
       * Selects an item range between two given items.
       *
       * @param begin {Object} Item to start with
       * @param end {Object} Item to end at
       */
      selectItemRange: function selectItemRange(begin, end) {
        var mode = this.getMode();

        if (mode == "single" || mode == "one") {
          throw new Error("Can not select multiple items in selection mode: " + mode);
        }

        this._selectItemRange(begin, end);

        this._setAnchorItem(begin);

        this._setLeadItem(end);

        this._scrollItemIntoView(end);

        this._fireChange();
      },

      /**
       * Clears the whole selection at once. Also
       * resets the lead and anchor items and their
       * styles.
       *
       */
      clearSelection: function clearSelection() {
        if (this.getMode() == "one") {
          var selected = this._applyDefaultSelection(true);

          if (selected != null) {
            return;
          }
        }

        this._clearSelection();

        this._setLeadItem(null);

        this._setAnchorItem(null);

        this._fireChange();
      },

      /**
       * Replaces current selection with given array of items.
       *
       * Please note that in single selection scenarios it is more
       * efficient to directly use {@link #selectItem}.
       *
       * @param items {Array} Items to select
       */
      replaceSelection: function replaceSelection(items) {
        var mode = this.getMode();

        if (mode == "one" || mode === "single") {
          if (items.length > 1) {
            throw new Error("Could not select more than one items in mode: " + mode + "!");
          }

          if (items.length == 1) {
            this.selectItem(items[0]);
          } else {
            this.clearSelection();
          }

          return;
        } else {
          this._replaceMultiSelection(items);
        }
      },

      /**
       * Get the selected item. This method does only work in <code>single</code>
       * selection mode.
       *
       * @return {Object} The selected item.
       */
      getSelectedItem: function getSelectedItem() {
        var mode = this.getMode();

        if (mode === "single" || mode === "one") {
          var result = this._getSelectedItem();

          return result != undefined ? result : null;
        }

        throw new Error("The method getSelectedItem() is only supported in 'single' and 'one' selection mode!");
      },

      /**
       * Returns an array of currently selected items.
       *
       * Note: The result is only a set of selected items, so the order can
       * differ from the sequence in which the items were added.
       *
       * @return {Object[]} List of items.
       */
      getSelection: function getSelection() {
        return Object.values(this.__selection__P_402_0);
      },

      /**
       * Returns the selection sorted by the index in the
       * container of the selection (the assigned widget)
       *
       * @return {Object[]} Sorted list of items
       */
      getSortedSelection: function getSortedSelection() {
        var children = this.getSelectables();
        var sel = Object.values(this.__selection__P_402_0);
        sel.sort(function (a, b) {
          return children.indexOf(a) - children.indexOf(b);
        });
        return sel;
      },

      /**
       * Detects whether the given item is currently selected.
       *
       * @param item {var} Any valid selectable item
       * @return {Boolean} Whether the item is selected
       */
      isItemSelected: function isItemSelected(item) {
        var hash = this._selectableToHashCode(item);

        return this.__selection__P_402_0[hash] !== undefined;
      },

      /**
       * Whether the selection is empty
       *
       * @return {Boolean} Whether the selection is empty
       */
      isSelectionEmpty: function isSelectionEmpty() {
        return qx.lang.Object.isEmpty(this.__selection__P_402_0);
      },

      /**
       * Invert the selection. Select the non selected and deselect the selected.
       */
      invertSelection: function invertSelection() {
        var mode = this.getMode();

        if (mode === "single" || mode === "one") {
          throw new Error("The method invertSelection() is only supported in 'multi' and 'additive' selection mode!");
        }

        var selectables = this.getSelectables();

        for (var i = 0; i < selectables.length; i++) {
          this._toggleInSelection(selectables[i]);
        }

        this._fireChange();
      },

      /*
      ---------------------------------------------------------------------------
        LEAD/ANCHOR SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the lead item. Generally the item which was last modified
       * by the user (tapped on etc.)
       *
       * @param value {Object} Any valid item or <code>null</code>
       */
      _setLeadItem: function _setLeadItem(value) {
        var old = this.__leadItem__P_402_17;

        if (old !== null) {
          this._styleSelectable(old, "lead", false);
        }

        if (value !== null) {
          this._styleSelectable(value, "lead", true);
        }

        this.__leadItem__P_402_17 = value;
      },

      /**
       * Returns the current lead item. Generally the item which was last modified
       * by the user (tapped on etc.)
       *
       * @return {Object} The lead item or <code>null</code>
       */
      getLeadItem: function getLeadItem() {
        return this.__leadItem__P_402_17;
      },

      /**
       * Sets the anchor item. This is the item which is the starting
       * point for all range selections. Normally this is the item which was
       * tapped on the last time without any modifier keys pressed.
       *
       * @param value {Object} Any valid item or <code>null</code>
       */
      _setAnchorItem: function _setAnchorItem(value) {
        var old = this.__anchorItem__P_402_18;

        if (old != null) {
          this._styleSelectable(old, "anchor", false);
        }

        if (value != null) {
          this._styleSelectable(value, "anchor", true);
        }

        this.__anchorItem__P_402_18 = value;
      },

      /**
       * Returns the current anchor item. This is the item which is the starting
       * point for all range selections. Normally this is the item which was
       * tapped on the last time without any modifier keys pressed.
       *
       * @return {Object} The anchor item or <code>null</code>
       */
      _getAnchorItem: function _getAnchorItem() {
        return this.__anchorItem__P_402_18 !== null ? this.__anchorItem__P_402_18 : null;
      },

      /*
      ---------------------------------------------------------------------------
        BASIC SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Whether the given item is selectable.
       *
       * @param item {var} Any item
       * @return {Boolean} <code>true</code> when the item is selectable
       */
      _isSelectable: function _isSelectable(item) {
        throw new Error("Abstract method call: _isSelectable()");
      },

      /**
       * Finds the selectable instance from a pointer event
       *
       * @param event {qx.event.type.Pointer} The pointer event
       * @return {Object|null} The resulting selectable
       */
      _getSelectableFromPointerEvent: function _getSelectableFromPointerEvent(event) {
        var target = event.getTarget(); // check for target (may be null when leaving the viewport) [BUG #4378]

        if (target && this._isSelectable(target)) {
          return target;
        }

        return null;
      },

      /**
       * Returns an unique hashcode for the given item.
       *
       * @param item {var} Any item
       * @return {String} A valid hashcode
       */
      _selectableToHashCode: function _selectableToHashCode(item) {
        throw new Error("Abstract method call: _selectableToHashCode()");
      },

      /**
       * Updates the style (appearance) of the given item.
       *
       * @param item {var} Item to modify
       * @param type {String} Any of <code>selected</code>, <code>anchor</code> or <code>lead</code>
       * @param enabled {Boolean} Whether the given style should be added or removed.
       */
      _styleSelectable: function _styleSelectable(item, type, enabled) {
        throw new Error("Abstract method call: _styleSelectable()");
      },

      /**
       * Enables capturing of the container.
       *
       */
      _capture: function _capture() {
        throw new Error("Abstract method call: _capture()");
      },

      /**
       * Releases capturing of the container
       *
       */
      _releaseCapture: function _releaseCapture() {
        throw new Error("Abstract method call: _releaseCapture()");
      },

      /*
      ---------------------------------------------------------------------------
        DIMENSION AND LOCATION
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the location of the container
       *
       * @return {Map} Map with the keys <code>top</code>, <code>right</code>,
       *    <code>bottom</code> and <code>left</code>.
       */
      _getLocation: function _getLocation() {
        throw new Error("Abstract method call: _getLocation()");
      },

      /**
       * Returns the dimension of the container (available scrolling space).
       *
       * @return {Map} Map with the keys <code>width</code> and <code>height</code>.
       */
      _getDimension: function _getDimension() {
        throw new Error("Abstract method call: _getDimension()");
      },

      /**
       * Returns the relative (to the container) horizontal location of the given item.
       *
       * @param item {var} Any item
       * @return {Map} A map with the keys <code>left</code> and <code>right</code>.
       */
      _getSelectableLocationX: function _getSelectableLocationX(item) {
        throw new Error("Abstract method call: _getSelectableLocationX()");
      },

      /**
       * Returns the relative (to the container) horizontal location of the given item.
       *
       * @param item {var} Any item
       * @return {Map} A map with the keys <code>top</code> and <code>bottom</code>.
       */
      _getSelectableLocationY: function _getSelectableLocationY(item) {
        throw new Error("Abstract method call: _getSelectableLocationY()");
      },

      /*
      ---------------------------------------------------------------------------
        SCROLL SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the scroll position of the container.
       *
       * @return {Map} Map with the keys <code>left</code> and <code>top</code>.
       */
      _getScroll: function _getScroll() {
        throw new Error("Abstract method call: _getScroll()");
      },

      /**
       * Scrolls by the given offset
       *
       * @param xoff {Integer} Horizontal offset to scroll by
       * @param yoff {Integer} Vertical offset to scroll by
       */
      _scrollBy: function _scrollBy(xoff, yoff) {
        throw new Error("Abstract method call: _scrollBy()");
      },

      /**
       * Scrolls the given item into the view (make it visible)
       *
       * @param item {var} Any item
       */
      _scrollItemIntoView: function _scrollItemIntoView(item) {
        throw new Error("Abstract method call: _scrollItemIntoView()");
      },

      /*
      ---------------------------------------------------------------------------
        QUERY SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Returns all selectable items of the container.
       *
       * @param all {Boolean} true for all selectables, false for the
        *   selectables the user can interactively select
       * @return {Array} A list of items
       */
      getSelectables: function getSelectables(all) {
        throw new Error("Abstract method call: getSelectables()");
      },

      /**
       * Returns all selectable items between the two given items.
       *
       * The items could be given in any order.
       *
       * @param item1 {var} First item
       * @param item2 {var} Second item
       * @return {Array} List of items
       */
      _getSelectableRange: function _getSelectableRange(item1, item2) {
        throw new Error("Abstract method call: _getSelectableRange()");
      },

      /**
       * Returns the first selectable item.
       *
       * @return {var} The first selectable item
       */
      _getFirstSelectable: function _getFirstSelectable() {
        throw new Error("Abstract method call: _getFirstSelectable()");
      },

      /**
       * Returns the last selectable item.
       *
       * @return {var} The last selectable item
       */
      _getLastSelectable: function _getLastSelectable() {
        throw new Error("Abstract method call: _getLastSelectable()");
      },

      /**
       * Returns a selectable item which is related to the given
       * <code>item</code> through the value of <code>relation</code>.
       *
       * @param item {var} Any item
       * @param relation {String} A valid relation: <code>above</code>,
       *    <code>right</code>, <code>under</code> or <code>left</code>
       * @return {var} The related item
       */
      _getRelatedSelectable: function _getRelatedSelectable(item, relation) {
        throw new Error("Abstract method call: _getRelatedSelectable()");
      },

      /**
       * Returns the item which should be selected on pageUp/pageDown.
       *
       * May also scroll to the needed position.
       *
       * @param lead {var} The current lead item
       * @param up {Boolean?false} Which page key was pressed:
       *   <code>up</code> or <code>down</code>.
       */
      _getPage: function _getPage(lead, up) {
        throw new Error("Abstract method call: _getPage()");
      },

      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */
      // property apply
      _applyMode: function _applyMode(value, old) {
        this._setLeadItem(null);

        this._setAnchorItem(null);

        this._clearSelection(); // Mode "one" requires one selected item


        if (value === "one") {
          this._applyDefaultSelection(true);
        }

        this._fireChange();
      },

      /*
      ---------------------------------------------------------------------------
        POINTER SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * This method should be connected to the <code>pointerover</code> event
       * of the managed object.
       *
       * @param event {qx.event.type.Pointer} A valid pointer event
       */
      handlePointerOver: function handlePointerOver(event) {
        // All browsers (except Opera) fire a native "mouseover" event when a scroll appears
        // by keyboard interaction. We have to ignore the event to avoid a selection for
        // "pointerover" (quick selection). For more details see [BUG #4225]
        if (this.__oldScrollTop__P_402_20 != null && this.__oldScrollTop__P_402_20 != this._getScroll().top) {
          this.__oldScrollTop__P_402_20 = null;
          return;
        } // quick select should only work on mouse events


        if (event.getPointerType() != "mouse") {
          return;
        } // this is a method invoked by an user interaction, so be careful to
        // set / clear the mark this._userInteraction [BUG #3344]


        this._userInteraction = true;

        if (!this.getQuick()) {
          this._userInteraction = false;
          return;
        }

        var mode = this.getMode();

        if (mode !== "one" && mode !== "single") {
          this._userInteraction = false;
          return;
        }

        var item = this._getSelectableFromPointerEvent(event);

        if (item === null) {
          this._userInteraction = false;
          return;
        }

        this._setSelectedItem(item); // Be sure that item is in view
        // This does not feel good when pointerover is used
        // this._scrollItemIntoView(item);
        // Fire change event as needed


        this._fireChange("quick");

        this._userInteraction = false;
      },

      /**
       * This method should be connected to the <code>pointerdown</code> event
       * of the managed object.
       *
       * @param event {qx.event.type.Pointer} A valid pointer event
       */
      handlePointerDown: function handlePointerDown(event) {
        // this is a method invoked by an user interaction, so be careful to
        // set / clear the mark this._userInteraction [BUG #3344]
        this._userInteraction = true;

        var item = this._getSelectableFromPointerEvent(event);

        if (item === null) {
          this._userInteraction = false;
          return;
        } // Read in keyboard modifiers


        var isCtrlPressed = event.isCtrlPressed() || qx.core.Environment.get("os.name") == "osx" && event.isMetaPressed();
        var isShiftPressed = event.isShiftPressed(); // tapping on selected items deselect on pointerup, not on pointerdown

        if (this.isItemSelected(item) && !isShiftPressed && !isCtrlPressed && !this.getDrag()) {
          this.__pointerDownOnSelected__P_402_19 = item;
          this._userInteraction = false;
          return;
        } else {
          this.__pointerDownOnSelected__P_402_19 = null;
        } // Be sure that item is in view


        this._scrollItemIntoView(item); // Drag selection


        var mode = this.getMode();

        if (this.getDrag() && mode !== "single" && mode !== "one" && !isShiftPressed && !isCtrlPressed && event.getPointerType() == "mouse") {
          this._setAnchorItem(item);

          this._setLeadItem(item); // Cache location/scroll data


          this.__frameLocation__P_402_7 = this._getLocation();
          this.__frameScroll__P_402_4 = this._getScroll(); // Store position at start

          this.__dragStartX__P_402_8 = event.getDocumentLeft() + this.__frameScroll__P_402_4.left;
          this.__dragStartY__P_402_9 = event.getDocumentTop() + this.__frameScroll__P_402_4.top; // Switch to capture mode

          this.__inCapture__P_402_10 = true;

          this._capture();
        } // Fire change event as needed


        this._fireChange("tap");

        this._userInteraction = false;
      },

      /**
       * This method should be connected to the <code>tap</code> event
       * of the managed object.
       *
       * @param event {qx.event.type.Tap} A valid pointer event
       */
      handleTap: function handleTap(event) {
        // this is a method invoked by an user interaction, so be careful to
        // set / clear the mark this._userInteraction [BUG #3344]
        this._userInteraction = true; // Read in keyboard modifiers

        var isCtrlPressed = event.isCtrlPressed() || qx.core.Environment.get("os.name") == "osx" && event.isMetaPressed();
        var isShiftPressed = event.isShiftPressed();

        if (!isCtrlPressed && !isShiftPressed && this.__pointerDownOnSelected__P_402_19 != null) {
          this._userInteraction = false;

          var item = this._getSelectableFromPointerEvent(event);

          if (item === null || !this.isItemSelected(item)) {
            return;
          }
        }

        var item = this._getSelectableFromPointerEvent(event);

        if (item === null) {
          this._userInteraction = false;
          return;
        } // Action depends on selected mode


        switch (this.getMode()) {
          case "single":
          case "one":
            this._setSelectedItem(item);

            break;

          case "additive":
            this._setLeadItem(item);

            this._setAnchorItem(item);

            this._toggleInSelection(item);

            break;

          case "multi":
            // Update lead item
            this._setLeadItem(item); // Create/Update range selection


            if (isShiftPressed) {
              var anchor = this._getAnchorItem();

              if (anchor === null) {
                anchor = this._getFirstSelectable();

                this._setAnchorItem(anchor);
              }

              this._selectItemRange(anchor, item, isCtrlPressed);
            } // Toggle in selection
            else if (isCtrlPressed) {
                this._setAnchorItem(item);

                this._toggleInSelection(item);
              } // Replace current selection
              else {
                  this._setAnchorItem(item);

                  this._setSelectedItem(item);
                }

            break;
        } // Cleanup operation


        this._userInteraction = false;

        this._cleanup();
      },

      /**
       * This method should be connected to the <code>losecapture</code> event
       * of the managed object.
       *
       * @param event {qx.event.type.Pointer} A valid pointer event
       */
      handleLoseCapture: function handleLoseCapture(event) {
        this._cleanup();
      },

      /**
       * This method should be connected to the <code>pointermove</code> event
       * of the managed object.
       *
       * @param event {qx.event.type.Pointer} A valid pointer event
       */
      handlePointerMove: function handlePointerMove(event) {
        // Only relevant when capturing is enabled
        if (!this.__inCapture__P_402_10) {
          return;
        } // Update pointer position cache


        this.__pointerX__P_402_11 = event.getDocumentLeft();
        this.__pointerY__P_402_12 = event.getDocumentTop(); // this is a method invoked by an user interaction, so be careful to
        // set / clear the mark this._userInteraction [BUG #3344]

        this._userInteraction = true; // Detect move directions

        var dragX = this.__pointerX__P_402_11 + this.__frameScroll__P_402_4.left;

        if (dragX > this.__dragStartX__P_402_8) {
          this.__moveDirectionX__P_402_13 = 1;
        } else if (dragX < this.__dragStartX__P_402_8) {
          this.__moveDirectionX__P_402_13 = -1;
        } else {
          this.__moveDirectionX__P_402_13 = 0;
        }

        var dragY = this.__pointerY__P_402_12 + this.__frameScroll__P_402_4.top;

        if (dragY > this.__dragStartY__P_402_9) {
          this.__moveDirectionY__P_402_14 = 1;
        } else if (dragY < this.__dragStartY__P_402_9) {
          this.__moveDirectionY__P_402_14 = -1;
        } else {
          this.__moveDirectionY__P_402_14 = 0;
        } // Update scroll steps


        var location = this.__frameLocation__P_402_7;

        if (this.__pointerX__P_402_11 < location.left) {
          this.__scrollStepX__P_402_1 = this.__pointerX__P_402_11 - location.left;
        } else if (this.__pointerX__P_402_11 > location.right) {
          this.__scrollStepX__P_402_1 = this.__pointerX__P_402_11 - location.right;
        } else {
          this.__scrollStepX__P_402_1 = 0;
        }

        if (this.__pointerY__P_402_12 < location.top) {
          this.__scrollStepY__P_402_2 = this.__pointerY__P_402_12 - location.top;
        } else if (this.__pointerY__P_402_12 > location.bottom) {
          this.__scrollStepY__P_402_2 = this.__pointerY__P_402_12 - location.bottom;
        } else {
          this.__scrollStepY__P_402_2 = 0;
        } // Dynamically create required timer instance


        if (!this.__scrollTimer__P_402_3) {
          this.__scrollTimer__P_402_3 = new qx.event.Timer(100);

          this.__scrollTimer__P_402_3.addListener("interval", this._onInterval, this);
        } // Start interval


        this.__scrollTimer__P_402_3.start(); // Auto select based on new cursor position


        this._autoSelect();

        event.stopPropagation();
        this._userInteraction = false;
      },

      /**
       * This method should be connected to the <code>addItem</code> event
       * of the managed object.
       *
       * @param e {qx.event.type.Data} The event object
       */
      handleAddItem: function handleAddItem(e) {
        var item = e.getData();

        if (this.getMode() === "one" && this.isSelectionEmpty()) {
          this.addItem(item);
        }
      },

      /**
       * This method should be connected to the <code>removeItem</code> event
       * of the managed object.
       *
       * @param e {qx.event.type.Data} The event object
       */
      handleRemoveItem: function handleRemoveItem(e) {
        this.removeItem(e.getData());
      },

      /*
      ---------------------------------------------------------------------------
        POINTER SUPPORT INTERNALS
      ---------------------------------------------------------------------------
      */

      /**
       * Stops all timers, release capture etc. to cleanup drag selection
       */
      _cleanup: function _cleanup() {
        if (!this.getDrag() && this.__inCapture__P_402_10) {
          return;
        } // Fire change event if needed


        if (this.__selectionModified__P_402_15) {
          this._fireChange("tap");
        } // Remove flags


        delete this.__inCapture__P_402_10;
        delete this.__lastRelX__P_402_5;
        delete this.__lastRelY__P_402_6; // Stop capturing

        this._releaseCapture(); // Stop timer


        if (this.__scrollTimer__P_402_3) {
          this.__scrollTimer__P_402_3.stop();
        }
      },

      /**
       * Event listener for timer used by drag selection
       *
       * @param e {qx.event.type.Event} Timer event
       */
      _onInterval: function _onInterval(e) {
        // Scroll by defined block size
        this._scrollBy(this.__scrollStepX__P_402_1, this.__scrollStepY__P_402_2); // Update scroll cache


        this.__frameScroll__P_402_4 = this._getScroll(); // Auto select based on new scroll position and cursor

        this._autoSelect();
      },

      /**
       * Automatically selects items based on the pointer movement during a drag selection
       */
      _autoSelect: function _autoSelect() {
        var inner = this._getDimension(); // Get current relative Y position and compare it with previous one


        var relX = Math.max(0, Math.min(this.__pointerX__P_402_11 - this.__frameLocation__P_402_7.left, inner.width)) + this.__frameScroll__P_402_4.left;

        var relY = Math.max(0, Math.min(this.__pointerY__P_402_12 - this.__frameLocation__P_402_7.top, inner.height)) + this.__frameScroll__P_402_4.top; // Compare old and new relative coordinates (for performance reasons)


        if (this.__lastRelX__P_402_5 === relX && this.__lastRelY__P_402_6 === relY) {
          return;
        }

        this.__lastRelX__P_402_5 = relX;
        this.__lastRelY__P_402_6 = relY; // Cache anchor

        var anchor = this._getAnchorItem();

        var lead = anchor; // Process X-coordinate

        var moveX = this.__moveDirectionX__P_402_13;
        var nextX, locationX;

        while (moveX !== 0) {
          // Find next item to process depending on current scroll direction
          nextX = moveX > 0 ? this._getRelatedSelectable(lead, "right") : this._getRelatedSelectable(lead, "left"); // May be null (e.g. first/last item)

          if (nextX !== null) {
            locationX = this._getSelectableLocationX(nextX); // Continue when the item is in the visible area

            if (moveX > 0 && locationX.left <= relX || moveX < 0 && locationX.right >= relX) {
              lead = nextX;
              continue;
            }
          } // Otherwise break


          break;
        } // Process Y-coordinate


        var moveY = this.__moveDirectionY__P_402_14;
        var nextY, locationY;

        while (moveY !== 0) {
          // Find next item to process depending on current scroll direction
          nextY = moveY > 0 ? this._getRelatedSelectable(lead, "under") : this._getRelatedSelectable(lead, "above"); // May be null (e.g. first/last item)

          if (nextY !== null) {
            locationY = this._getSelectableLocationY(nextY); // Continue when the item is in the visible area

            if (moveY > 0 && locationY.top <= relY || moveY < 0 && locationY.bottom >= relY) {
              lead = nextY;
              continue;
            }
          } // Otherwise break


          break;
        } // Differenciate between the two supported modes


        var mode = this.getMode();

        if (mode === "multi") {
          // Replace current selection with new range
          this._selectItemRange(anchor, lead);
        } else if (mode === "additive") {
          // Behavior depends on the fact whether the
          // anchor item is selected or not
          if (this.isItemSelected(anchor)) {
            this._selectItemRange(anchor, lead, true);
          } else {
            this._deselectItemRange(anchor, lead);
          } // Improve performance. This mode does not rely
          // on full ranges as it always extend the old
          // selection/deselection.


          this._setAnchorItem(lead);
        } // Fire change event as needed


        this._fireChange("drag");
      },

      /*
      ---------------------------------------------------------------------------
        KEYBOARD SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * @type {Map} All supported navigation keys
       *
       * @lint ignoreReferenceField(__navigationKeys)
       */
      __navigationKeys__P_402_21: {
        Home: 1,
        Down: 1,
        Right: 1,
        PageDown: 1,
        End: 1,
        Up: 1,
        Left: 1,
        PageUp: 1
      },

      /**
       * This method should be connected to the <code>keypress</code> event
       * of the managed object.
       *
       * @param event {qx.event.type.KeySequence} A valid key sequence event
       */
      handleKeyPress: function handleKeyPress(event) {
        // this is a method invoked by an user interaction, so be careful to
        // set / clear the mark this._userInteraction [BUG #3344]
        this._userInteraction = true;
        var current, next;
        var key = event.getKeyIdentifier();
        var mode = this.getMode(); // Support both control keys on Mac

        var isCtrlPressed = event.isCtrlPressed() || qx.core.Environment.get("os.name") == "osx" && event.isMetaPressed();
        var isShiftPressed = event.isShiftPressed();
        var consumed = false;

        if (key === "A" && isCtrlPressed) {
          if (mode !== "single" && mode !== "one") {
            this._selectAllItems();

            consumed = true;
          }
        } else if (key === "Escape") {
          if (mode !== "single" && mode !== "one") {
            this._clearSelection();

            consumed = true;
          }
        } else if (key === "Space") {
          var lead = this.getLeadItem();

          if (lead != null && !isShiftPressed) {
            if (isCtrlPressed || mode === "additive") {
              this._toggleInSelection(lead);
            } else {
              this._setSelectedItem(lead);
            }

            consumed = true;
          }
        } else if (this.__navigationKeys__P_402_21[key]) {
          consumed = true;

          if (mode === "single" || mode == "one") {
            current = this._getSelectedItem();
          } else {
            current = this.getLeadItem();
          }

          if (current !== null) {
            switch (key) {
              case "Home":
                next = this._getFirstSelectable();
                break;

              case "End":
                next = this._getLastSelectable();
                break;

              case "Up":
                next = this._getRelatedSelectable(current, "above");
                break;

              case "Down":
                next = this._getRelatedSelectable(current, "under");
                break;

              case "Left":
                next = this._getRelatedSelectable(current, "left");
                break;

              case "Right":
                next = this._getRelatedSelectable(current, "right");
                break;

              case "PageUp":
                next = this._getPage(current, true);
                break;

              case "PageDown":
                next = this._getPage(current, false);
                break;
            }
          } else {
            switch (key) {
              case "Home":
              case "Down":
              case "Right":
              case "PageDown":
                next = this._getFirstSelectable();
                break;

              case "End":
              case "Up":
              case "Left":
              case "PageUp":
                next = this._getLastSelectable();
                break;
            }
          } // Process result


          if (next !== null) {
            switch (mode) {
              case "single":
              case "one":
                this._setSelectedItem(next);

                break;

              case "additive":
                this._setLeadItem(next);

                break;

              case "multi":
                if (isShiftPressed) {
                  var anchor = this._getAnchorItem();

                  if (anchor === null) {
                    this._setAnchorItem(anchor = this._getFirstSelectable());
                  }

                  this._setLeadItem(next);

                  this._selectItemRange(anchor, next, isCtrlPressed);
                } else {
                  this._setAnchorItem(next);

                  this._setLeadItem(next);

                  if (!isCtrlPressed) {
                    this._setSelectedItem(next);
                  }
                }

                break;
            }

            this.__oldScrollTop__P_402_20 = this._getScroll().top;

            this._scrollItemIntoView(next);
          }
        }

        if (consumed) {
          // Stop processed events
          event.stop(); // Fire change event as needed

          this._fireChange("key");
        }

        this._userInteraction = false;
      },

      /*
      ---------------------------------------------------------------------------
        SUPPORT FOR ITEM RANGES
      ---------------------------------------------------------------------------
      */

      /**
       * Adds all items to the selection
       */
      _selectAllItems: function _selectAllItems() {
        var range = this.getSelectables();

        for (var i = 0, l = range.length; i < l; i++) {
          this._addToSelection(range[i]);
        }
      },

      /**
       * Clears current selection
       */
      _clearSelection: function _clearSelection() {
        var selection = this.__selection__P_402_0;

        for (var hash in selection) {
          this._removeFromSelection(selection[hash]);
        }

        this.__selection__P_402_0 = {};
      },

      /**
       * Select a range from <code>item1</code> to <code>item2</code>.
       *
       * @param item1 {Object} Start with this item
       * @param item2 {Object} End with this item
       * @param extend {Boolean?false} Whether the current
       *    selection should be replaced or extended.
       */
      _selectItemRange: function _selectItemRange(item1, item2, extend) {
        var range = this._getSelectableRange(item1, item2); // Remove items which are not in the detected range


        if (!extend) {
          var selected = this.__selection__P_402_0;

          var mapped = this.__rangeToMap__P_402_22(range);

          for (var hash in selected) {
            if (!mapped[hash]) {
              this._removeFromSelection(selected[hash]);
            }
          }
        } // Add new items to the selection


        for (var i = 0, l = range.length; i < l; i++) {
          this._addToSelection(range[i]);
        }
      },

      /**
       * Deselect all items between <code>item1</code> and <code>item2</code>.
       *
       * @param item1 {Object} Start with this item
       * @param item2 {Object} End with this item
       */
      _deselectItemRange: function _deselectItemRange(item1, item2) {
        var range = this._getSelectableRange(item1, item2);

        for (var i = 0, l = range.length; i < l; i++) {
          this._removeFromSelection(range[i]);
        }
      },

      /**
       * Internal method to convert a range to a map of hash
       * codes for faster lookup during selection compare routines.
       *
       * @param range {Array} List of selectable items
       */
      __rangeToMap__P_402_22: function __rangeToMap__P_402_22(range) {
        var mapped = {};
        var item;

        for (var i = 0, l = range.length; i < l; i++) {
          item = range[i];
          mapped[this._selectableToHashCode(item)] = item;
        }

        return mapped;
      },

      /*
      ---------------------------------------------------------------------------
        SINGLE ITEM QUERY AND MODIFICATION
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the first selected item. Only makes sense
       * when using manager in single selection mode.
       *
       * @return {var} The selected item (or <code>null</code>)
       */
      _getSelectedItem: function _getSelectedItem() {
        for (var hash in this.__selection__P_402_0) {
          return this.__selection__P_402_0[hash];
        }

        return null;
      },

      /**
       * Replace current selection with given item.
       *
       * @param item {var} Any valid selectable item
       */
      _setSelectedItem: function _setSelectedItem(item) {
        if (this._isSelectable(item)) {
          // If already selected try to find out if this is the only item
          var current = this.__selection__P_402_0;

          var hash = this._selectableToHashCode(item);

          if (!current[hash] || current.length >= 2) {
            this._clearSelection();

            this._addToSelection(item);
          }
        }
      },

      /*
      ---------------------------------------------------------------------------
        MODIFY ITEM SELECTION
      ---------------------------------------------------------------------------
      */

      /**
       * Adds an item to the current selection.
       *
       * @param item {Object} Any item
       */
      _addToSelection: function _addToSelection(item) {
        var hash = this._selectableToHashCode(item);

        if (this.__selection__P_402_0[hash] == null && this._isSelectable(item)) {
          this.__selection__P_402_0[hash] = item;

          this._styleSelectable(item, "selected", true);

          this.__selectionModified__P_402_15 = true;
        }
      },

      /**
       * Toggles the item e.g. remove it when already selected
       * or select it when currently not.
       *
       * @param item {Object} Any item
       */
      _toggleInSelection: function _toggleInSelection(item) {
        var hash = this._selectableToHashCode(item);

        if (this.__selection__P_402_0[hash] == null) {
          this.__selection__P_402_0[hash] = item;

          this._styleSelectable(item, "selected", true);
        } else {
          delete this.__selection__P_402_0[hash];

          this._styleSelectable(item, "selected", false);
        }

        this.__selectionModified__P_402_15 = true;
      },

      /**
       * Removes the given item from the current selection.
       *
       * @param item {Object} Any item
       */
      _removeFromSelection: function _removeFromSelection(item) {
        var hash = this._selectableToHashCode(item);

        if (this.__selection__P_402_0[hash] != null) {
          delete this.__selection__P_402_0[hash];

          this._styleSelectable(item, "selected", false);

          this.__selectionModified__P_402_15 = true;
        }
      },

      /**
       * Replaces current selection with items from given array.
       *
       * @param items {Array} List of items to select
       */
      _replaceMultiSelection: function _replaceMultiSelection(items) {
        if (items.length === 0) {
          this.clearSelection();
          return;
        }

        var modified = false; // Build map from hash codes and filter non-selectables

        var selectable, hash;
        var incoming = {};

        for (var i = 0, l = items.length; i < l; i++) {
          selectable = items[i];

          if (this._isSelectable(selectable)) {
            hash = this._selectableToHashCode(selectable);
            incoming[hash] = selectable;
          }
        } // Remember last


        var first = items[0];
        var last = selectable; // Clear old entries from map

        var current = this.__selection__P_402_0;

        for (var hash in current) {
          if (incoming[hash]) {
            // Reduce map to make next loop faster
            delete incoming[hash];
          } else {
            // update internal map
            selectable = current[hash];
            delete current[hash]; // apply styling

            this._styleSelectable(selectable, "selected", false); // remember that the selection has been modified


            modified = true;
          }
        } // Add remaining selectables to selection


        for (var hash in incoming) {
          // update internal map
          selectable = current[hash] = incoming[hash]; // apply styling

          this._styleSelectable(selectable, "selected", true); // remember that the selection has been modified


          modified = true;
        } // Do not do anything if selection is equal to previous one


        if (!modified) {
          return false;
        } // Scroll last incoming item into view


        this._scrollItemIntoView(last); // Reset anchor and lead item


        this._setLeadItem(first);

        this._setAnchorItem(first); // Finally fire change event


        this.__selectionModified__P_402_15 = true;

        this._fireChange();
      },

      /**
       * Fires the selection change event if the selection has
       * been modified.
       *
       * @param context {String} One of <code>tap</code>, <code>quick</code>,
       *    <code>drag</code> or <code>key</code> or <code>null</code>
       */
      _fireChange: function _fireChange(context) {
        if (this.__selectionModified__P_402_15) {
          // Store context
          this.__selectionContext__P_402_16 = context || null; // Fire data event which contains the current selection

          this.fireDataEvent("changeSelection", this.getSelection());
          delete this.__selectionModified__P_402_15;
        }
      },

      /**
       * Applies the default selection. The default item is the first item.
       *
       * @param force {Boolean} Whether the default selection should be forced.
       *
       * @return {var} The selected item.
       */
      _applyDefaultSelection: function _applyDefaultSelection(force) {
        if (force === true || this.getMode() === "one" && this.isSelectionEmpty()) {
          var first = this._getFirstSelectable();

          if (first != null) {
            this.selectItem(first);
          }

          return first;
        }

        return null;
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct: function destruct() {
      this._disposeObjects("__scrollTimer__P_402_3");

      this.__selection__P_402_0 = this.__pointerDownOnSelected__P_402_19 = this.__anchorItem__P_402_18 = null;
      this.__leadItem__P_402_17 = null;
    }
  });
  qx.ui.core.selection.Abstract.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Abstract.js.map?dt=1592866031551