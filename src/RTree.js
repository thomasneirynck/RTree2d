define(['./SubTree', './type'], function(SubTree, type) {

  "use strict";

  function accumulate(acc, ob) {
    acc.push(ob);
    return acc;
  }

  /**
   *
   * Create a new RTree.
   *
   * @param {Object} [configuration]
   * @param {Number} [configuration.branchingFactor] branching factor of the tree (a node will be split when it has more children than the branching factor)
   * @constructor
   * @name RTree
   */


  return type({

    constructor: function(configuration) {
      configuration = configuration || {};
      this._branchingFactor = (configuration.branchingFactor >= 3) ? configuration.branchingFactor : 16;
      this._root = null;
      this._size = 0;
    },

    _growTree: function(node1, node2) {
      var newRoot = new SubTree(node1.l, node1.b, node1.w, node1.h, this._branchingFactor);
      newRoot._addChild(node1);
      newRoot._addChild(node2);
      newRoot.depth = this._root.depth + 1;//keep track of depth (debugging purposes only)
      this._root = newRoot;
    },

    /**
     * Draws the rtree to a html5 canvas 2d context
     * @param {context2d} context2d HTML5 canvas 2d context
     * @function
     * @memberOf RTree#
     */
    draw: function(context2d) {
      if (this._root) {
        this._root.draw(context2d);
      }
    },

    /**
     * Gets the number of object in the tree.
     * @return {Number} the number of elements in the tree.
     * @function
     * @memberOf RTree#
     */
    size: function() {
      return this._size;
    },

    /**
     * Apply the callback to each object that interacts with the rectang.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @param {Function} action called for each element interacting with the rectang
     * @function
     * @memberOf RTree#
     */
    forEachInRectangle: function(x, y, w, h, action) {
      if (this._root) {
        this._root._search(x, y, w, h, action);
      }
    },

    /**
     * Apply the map function to each object that interacts with the rectang and add it to the result.

     * @param {Number} x the x coordinate of the rectangle
     * @param {Number} y the y coordinate of the rectangle
     * @param {Number} w the width of the rectangle
     * @param {Number} h the height of the rectangle
     * @param {Function} map called for each element, returns a mapped object/value.
     * @returns {Array} collection with all mapped values.
     * @function
     * @memberOf RTree#
     */
    mapInRectangle: (function() {
      var mapfunc, maps;
      var mapSpool = function(it) {
        maps.push(mapfunc(it));
      };
      return function(x, y, w, h, func) {
        maps = [];
        mapfunc = func;
        this.forEachInRectangle(x, y, w, h, mapSpool);
        return maps;
      }
    }()),

    /**
     * Fold collection into single value.
     *
     * @param {Object} object element to add
     * @param {Number} x the x coordinate of the rectangle
     * @param {Number} y the y coordinate of the rectangle
     * @param {Number} w the width of the rectangle
     * @param {Number} h the height of the rectangle
     * @param {Function} fold a reduce function, taking two arguments, the accumulator and an object interacting with the search rectang.
     * @param {Object} [initial] initial accumulator
     * @returns {Object} accumulated value
     *
     * @memberOf RTree#
     * @function
     *
     */
    reduceInRectangle: (function() {
      var folder, accum, i;
      var reduceSpool = function(val) {
        accum = (i === 0 && typeof accum === 'undefined' ) ? val :
                folder(accum, val);
        i += 1;
        return accum;
      };
      return function(x, y, w, h, fold, initial) {
        accum = initial;
        folder = fold;
        i = 0;
        this.forEachInRectangle(x, y, w, h, reduceSpool);
        return accum;
      };
    }()),


    /**
     *
     * Search the RTree.
     *
     * @param {Number} x the x coordinate of the rectangle
     * @param {Number} y the y coordinate of the rectangle
     * @param {Number} w the width of the rectangle
     * @param {Number} h the height of the rectangle* @returns {Array} objects interaction with the search rectang
     */
    search: function(x, y, w, h) {
      return this.reduceInRectangle(x, y, w, h, accumulate, []);
    },

    /**
     *
     * Add an object to the RTree.
     * @param {Object} object element to add
     * @param {Number} x the x coordinate of the rectangle
     * @param {Number} y the y coordinate of the rectangle
     * @param {Number} w the width of the rectangle
     * @param {Number} h the height of the rectangle
     * @function
     * @memberOf RTree#
     */
    insert: function(object, x, y, w, h) {
      if (!this._root) {
        this._root = new SubTree(x, y, w, h, this._branchingFactor);
        this._root.leaf = true;
      }
      this._root._insert(object, x, y, w, h, this);
      this._size += 1;
      return this;
    },


    /**
     * Remove the object from the RTree
     *
     * @param {Object} object the object to remove
     * @param {Number} x corresponding x of the object
     * @param {Number} y corresponding y of the object
     * @param {Number} w corresponding w of the object
     * @param {Number} h corresponding h of the object
     *
     * @memberOf RTree#
     * @function
     */
    remove: function(object, x, y, w, h) {
      console.log('this.size before', this.size());
      var removed = this._root._remove(object, x, y, w, h, this);
      if (removed) {
        this._size -= 1;
      }
      console.log('after', this.size());
      return this;
    }


  });

});