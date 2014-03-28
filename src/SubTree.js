define([
  './Rectangle',
  './SubTreeDebugMixin',
  './type'
], function(Rectangle, SubTreeDebugMixin, type) {


  var Entry = type({}, Rectangle.prototype, {
    constructor: function(object, x, y, w, h) {
      this.__nextSibling = null;
      this.object = object;
      Rectangle.call(this, x, y, w, h);
    },
    draw: function(context) {
      context.strokeStyle = 'rgba(0,0,255,1)';
      context.strokeRect(this.l, this.b, this.w, this.h);
    },
    toString: function() {
      var s = Rectangle.prototype.toString.call(this);
      return s + " entry";
    }
  });


  function reassignRemainingToSeeds(node, seed1, seed2) {
    var cost1, cost2, next;
    while (node) {
      next = node.__nextSibling;
      cost1 = seed1.expansionCost(node.l, node.b, node.r, node.t);
      cost2 = seed2.expansionCost(node.l, node.b, node.r, node.t);
      if (cost1 < cost2) {
        seed1._addChild(node);
      } else {
        seed1._addChild(node);
      }
      node = next;
    }
  }

  return type({}, Rectangle.prototype, SubTreeDebugMixin, {

    constructor: function(x, y, w, h, bf) {

      //Initialize.
      this.leaf = false;
      this.size = 0;
      this.branchingFactor = bf;
      this.parent = null;
      this.depth = 0;

      //The children are stored as a doubly linked list, with the head attached to the parent itself.
      this.__firstChild = null;
      this.__nextSibling = null;
      this.__previousSibling = null;

      //Trees are searched depth first.
      //In <code>_search()</code>, we use .__nextSearch to string together a linked list of nodes we still need to explore (aka. the "stack").
      this.__nextSearch = null;

      //simulate multiple return values when doing method pickSeeds by storing the results here.
      this._seed1 = null;
      this._seed2 = null;

      Rectangle.call(this, x, y, w, h);

    },

    draw: function(context2d) {

      context2d.lineWidth = this.depth + 1;
      context2d.strokeStyle = this.leaf ? 'rgba(255,0,0,1)' : 'rgba(0,0,0,1)';
      context2d.strokeRect(this.l, this.b, this.w, this.h);

      var child = this.__firstChild;
      while (child) {
        child.draw(context2d);
        child = child.__nextSibling;
      }
    },

    _callWhenInteracts: function(x, y, tx, ty, callback) {
      var entry = this.__firstChild;
      while (entry) {
        if (entry.interacts(x, y, tx, ty)) {
          callback(entry.object);
        }
        entry = entry.__nextSibling;
      }
    },

    _addPossiblePathsToCallstack: function(x, y, tx, ty) {
      var child = this.__firstChild;
      while (child) {
        if (child.interacts(x, y, tx, ty)) {
          child.__nextSearch = this.__nextSearch;
          this.__nextSearch = child;
        }
        child = child.__nextSibling;
      }
    },

    _search: function(x, y, w, h, callback) {

      var tx = x + w;
      var ty = y + h;
      var tmp;
      var searchNode = this;
      while (searchNode) {
        if (searchNode.leaf) {
          searchNode._callWhenInteracts(x, y, tx, ty, callback);
        } else {
          searchNode._addPossiblePathsToCallstack(x, y, tx, ty);
        }
        tmp = searchNode.__nextSearch;
        searchNode.__nextSearch = null;//kill the dangling pointer
        searchNode = tmp;
      }

    },

    _selectBestInsertion: function(x, y, tx, ty) {
      var tentativeCost, bestNode;
      var bestCost = Infinity;
      var child = this.__firstChild;
      while (child) {
        tentativeCost = child.expansionCost(x, y, tx, ty);
        if (tentativeCost < bestCost) {
          bestCost = tentativeCost;
          bestNode = child;
        }
        child = child.__nextSibling;
      }
      return bestNode;
    },


    _insert: function(object, x, y, w, h, treeBase) {
      var entry = new Entry(object, x, y, w, h);
      var bestNode = this;
      while (!bestNode.leaf) {
        bestNode.include(x, y, entry.r, entry.t);
        bestNode = bestNode._selectBestInsertion(x, y, entry.r, entry.t);
      }
      bestNode._addChild(entry);
      bestNode._propagateSplit(treeBase);

    },

    _propagateSplit: function(treeBase) {
      var node = this;
      var splitNode;
      while (node && node.size > node.branchingFactor) {
        splitNode = node._split();
        if (node.parent) {
          pushNodeOnLinkedList(node.parent, splitNode);
        } else {
          treeBase._growTree(node, splitNode);
        }
        node = node.parent;
      }
    },

    toString: function() {
      return Rectangle.prototype.toString.call(this) + " l: " + this.leaf;
    },

    _pushNodeOnLinkedList: function(newHead) {
      newHead.__nextSibling = this.__firstChild;
      newHead.__nextSibling.__previousSibling = newHead;
      this.__firstChild = newHead;
      newHead.__previousSibling = null;
      newHead.this = this;
      this.size += 1;
    },

    _setFirstNodeInLinkedList: function(newHead) {
      this.__firstChild = newHead;
      newHead.__previousSibling = null;
      newHead.__nextSibling = null;
      newHead.this = this;
      this.size = 1;
    },

    _removeNodeFromLinkedList: function(child) {

      if (this.__firstChild === child) {
        this.__firstChild = child.__nextSibling;
        if (this.__firstChild) {
          this.__firstChild.__previousSibling = null;
        }
      } else {
        if (child.__previousSibling) {
          child.__previousSibling.__nextSibling = child.__nextSibling;
        }
        if (child.__nextSibling) {
          child.__nextSibling.__previousSibling = child.__previousSibling;
        }
      }
      child.__nextSibling = null;
      child.__previousSibling = null;
      this.size -= 1;
    },

    _split: function() {

      this.pickSeeds();
      this._removeNodeFromLinkedList(this._seed1);
      this._removeNodeFromLinkedList(this._seed2);


      var firstUnassigned = this.__firstChild;//keep track of the head.
      this.__firstChild = null;
      this._addChild(this._seed1);
      var node2 = this.clone();
      node2._addChild(this._seed2);

      reassignRemainingToSeeds(firstUnassigned, this, node2);
      this._seed1 = this;
      this._seed2 = node2;

      return node2;

    },

    /**
     * ang tang linear split.
     */
    pickSeeds: function() {

      var leftmost = this.__firstChild;
      var rightmost = this.__firstChild;
      var topmost = this.__firstChild;
      var bottommost = this.__firstChild;

      var child = this.__firstChild.__nextSibling;
      while (child) {
        if (child.r < leftmost.r) leftmost = child;
        if (child.l > rightmost.l) rightmost = child;
        if (child.t < bottommost.t) bottommost = child;
        if (child.b > topmost.b) topmost = child;
        child = child.__nextSibling;
      }

      var wdiff = Math.abs(rightmost.l - leftmost.r);
      var hdiff = Math.abs((topmost.b - bottommost.t) * this.w / this.h);
      var a, b, c, d;
      if (wdiff > hdiff) {
        a = leftmost;
        b = rightmost;
        c = bottommost;
        d = topmost;
      } else {
        c = leftmost;
        d = rightmost;
        a = bottommost;
        b = topmost;
      }
      if (a !== b) {
        this._seed1 = a;
        this._seed2 = b;
      } else if (c !== d) {
        this._seed1 = c;
        this._seed2 = d;
      } else {//worst case. cannot distinguish.
        this._seed1 = this.__firstChild;
        this._seed2 = this.__firstChild.__nextSibling;
      }
    },

    _findMatchingEntry: function(object) {
      var entry = this.__firstChild;
      while (entry) {
        if (entry.object === object) {
          return entry;
        }
        entry = entry.__nextSibling;
      }
    },
    _remove: function(object, x, y, w, h, treebase) {

      var tmp, entry;
      var nodeToExplore = this;

      var tx = x + w;
      var ty = y + h;

      while (nodeToExplore) {
        if (nodeToExplore.leaf) {
          entry = nodeToExplore._findMatchingEntry(object);
          if (entry) {
            nodeToExplore._removeChild(entry, treebase);
            return true;
          }
        } else {
          nodeToExplore._addPossiblePathsToCallstack(x, y, tx, ty);
        }
        tmp = nodeToExplore.__nextSearch;
        nodeToExplore.__nextSearch = null;//kill dangling pointer
        nodeToExplore = tmp;
      }

      return false;
    },

    _fitBounds: function() {
      this.reset();
      var child = this.__firstChild;
      while (child) {
        this.include(child.l, child.b, child.r, child.t);
        child = child.__nextSibling
      }
    },

    clone: function() {
      var node2 = new this.constructor(this.l, this.b, this.w, this.h, this.branchingFactor);
      node2.parent = this.parent;
      node2.depth = this.depth;
      node2.leaf = this.leaf;
    },

    _removeChild: function(nodeToRemove, treebase) {

      //travel up the tree once. adjust the bounds of the parent, and remove node if necessary.

      var node = this;

      while (node) {
        if (nodeToRemove) {
          nodeToRemove.parent._removeNodeFromLinkedList(nodeToRemove);
        }
        node._fitBounds();
        nodeToRemove = (node.size === 0) ? node : null;
        node = node.parent;
      }

      if (nodeToRemove) {//We reached the top, which appears to be empty.
        treebase._root = null;
        treebase._size = 0;
      }

    },

    _addChild: function(node) {
      if (this.__firstChild) {
        this._pushNodeOnLinkedList(node);
      } else {
        this._setFirstNodeInLinkedList(node);
        this.reset();
      }
      this.include(node.l, node.b, node.r, node.t);
    }

  });

});