define([
  './Rectangle',
  './BranchMixin',
  './type',
  './PriorityQueue'
], function(Rectangle, BranchMixin, type, PriorityQueue) {

  var PRIORITY_QUEUE = new PriorityQueue(function(node1, node2) {
    return node1.__dist - node2.__dist;
  });


  var Entry = type({}, Rectangle.prototype, {
    isEntry: true,
    constructor: function(object, x, y, w, h) {
      this.object = object;
      this.__nextSibling = null;
      this.__dist = 0;
      Rectangle.call(this, x, y, w, h);
    },
    draw: function(context) {
      context.fillStyle = 'rgba(240,240,230,0.7)';
      context.fillRect(this.l, this.b, this.w, this.h);
    },
    toString: function() {
      var s = Rectangle.prototype.toString.call(this);
      return s + " entry";
    }
  });


  function reassignRemainingToSeeds(node, seed1, seed2) {
    var next;
    while (node) {
      next = node.__nextSibling;
      if (seed1.expansionCost(node.l, node.b, node.r, node.t) < seed2.expansionCost(node.l, node.b, node.r, node.t)) {
        seed1._addChild(node);
      } else {
        seed2._addChild(node);
      }
      node = next;
    }
  }

  function drawToContext(context, child) {
    if (child.draw) {
      child.draw(context);
    }
    return context;
  }

  return type({}, Rectangle.prototype, BranchMixin, {
    isEntry: false,
    constructor: function(x, y, w, h, bf) {

      this.leaf = false;
      this.size = 0;
      this.branchingFactor = bf;
      this.parent = null;
      this.depth = 0;

      this.__dist = 0;

      this.__firstChild = null;
      this.__nextSibling = null;
      this.__previousSibling = null;

      this.__nextSearch = null;

      this._seed1 = null;
      this._seed2 = null;

      Rectangle.call(this, x, y, w, h);

    },

    draw: function(context2d) {
      context2d.lineWidth = Math.ceil((this.depth + 1)/2);
      context2d.strokeStyle = this.leaf ? 'rgba(205,192,176,0.8)' : 'rgba(139,131,120,0.9)';
      context2d.strokeRect(this.l, this.b, this.w, this.h);
      this._foldChildren(drawToContext, context2d);
    },

    _foldChildren: function(fold, accum) {
      var child = this.__firstChild;
      while (child) {
        accum = fold(accum, child);
        child = child.__nextSibling;
      }
      return accum;
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

    _addPathsToSearchStack: function(x, y, tx, ty) {
      var child = this.__firstChild;
      while (child) {
        if (child.interacts(x, y, tx, ty)) {
          child.__nextSearch = this.__nextSearch;
          this.__nextSearch = child;
        }
        child = child.__nextSibling;
      }
    },

    _nextOnSearchStack: function() {
      var tmp = this.__nextSearch;
      this.__nextSearch = null;//kill the dangling pointer
      return tmp;
    },

    _addToQueue: function(x, y) {
      var child = this.__firstChild;
      while (child) {
        child.__dist = child.squaredDistanceTo(x, y);
        PRIORITY_QUEUE.enqueue(child);
        child = child.__nextSibling;
      }
    },

    _knn: function(x, y, k, callback) {

      PRIORITY_QUEUE.clear();
      var node = this;
      while (k && node) {
        if (node.isEntry) {
          k -= 1;
          callback(node.object);
        } else {
          node._addToQueue(x, y);
        }
        node = PRIORITY_QUEUE.dequeue();
      }
    },

    _search: function(x, y, w, h, callback) {

      var tx = x + w;
      var ty = y + h;
      var searchNode = this;
      do {
        if (searchNode.leaf) {
          searchNode._callWhenInteracts(x, y, tx, ty, callback);
        } else {
          searchNode._addPathsToSearchStack(x, y, tx, ty);
        }
        searchNode = searchNode._nextOnSearchStack();
      } while (searchNode);

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
          node.parent._addChild(splitNode);
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
      newHead.__previousSibling = null;
      this.__firstChild = newHead;
    },

    _setFirstNodeInLinkedList: function(newHead) {
      newHead.__previousSibling = null;
      newHead.__nextSibling = null;
      this.__firstChild = newHead;
    },

    _removeNodeFromLinkedList: function(child) {
      if (this.__firstChild === child) {
        this.__firstChild = child.__nextSibling;
        if (this.__firstChild) {
          this.__firstChild.__previousSibling = null;
        }
      } else {
        child.__previousSibling.__nextSibling = child.__nextSibling;
        if (child.__nextSibling) {
          child.__nextSibling.__previousSibling = child.__previousSibling;
        }
      }
      child.__nextSibling = null;
      child.__previousSibling = null;
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

      return node2;

    },

    /**
     * ang tan linear split
     *
     * @private
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

      var a, b, c, d;
      if (Math.abs(rightmost.l - leftmost.r) > Math.abs((topmost.b - bottommost.t) * this.w / this.h)) {
        a = leftmost;
        b = rightmost;
        c = bottommost;
        d = topmost;
      } else {
        a = bottommost;
        b = topmost;
        c = leftmost;
        d = rightmost;
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

      var entry;

      var tx = x + w;
      var ty = y + h;

      var searchNode = this;
      do {
        if (searchNode.leaf) {
          entry = searchNode._findMatchingEntry(object);
          if (entry) {
            searchNode._removeAndPropagate(entry, treebase);
            return true;
          }
        } else {
          searchNode._addPathsToSearchStack(x, y, tx, ty);
        }
        searchNode = searchNode._nextOnSearchStack();
      } while (searchNode);

      return false;
    },

    _fitBounds: function() {
      this.reset();
      var child = this.__firstChild;
      while (child) {
        this.include(child.l, child.b, child.r, child.t);
        child = child.__nextSibling;
      }
    },

    clone: function() {
      var clone = new this.constructor(this.l, this.b, this.w, this.h, this.branchingFactor);
      clone.parent = this.parent;
      clone.depth = this.depth;
      clone.leaf = this.leaf;
      return clone;
    },

    _removeNode: function(node) {
      this._removeNodeFromLinkedList(node);
      this.size -= 1;
      node.parent = null;
      this._fitBounds();
    },

    _removeAndPropagate: function(child, treebase) {

      var node = this;
      do {
        if (child) {
          node._removeNode(child);
        } else {
          node._fitBounds();
        }
        child = (node.size === 0) ? node : null;
        node = node.parent;
      } while (node);

      if (child) {//We reached the top, which appears to be empty.
        treebase._root = null;
      }
    },

    _addChild: function(node) {
      if (this.__firstChild) {
        this._pushNodeOnLinkedList(node);
        this.size += 1;
      } else {
        this._setFirstNodeInLinkedList(node);
        this.size = 1;
        this.reset();
      }
      node.parent = this;
      this.include(node.l, node.b, node.r, node.t);
    }

  });

});