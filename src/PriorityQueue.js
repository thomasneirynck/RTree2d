define(['./type'], function(type) {


  //adapted from http://eloquentjavascript.net/appendix2.html.
  return type({

    constructor: function(comparator) {
      this._items = [];
      this._comp = comparator;
    },

    size: function() {
      return this._items.length;
    },

    clear: function() {
      this._items.length = 0;
    },

    enqueue: function(node) {
      this._items.push(node);
      this._bubble(this._items.length - 1);
    },

    dequeue: function() {
      var result = this._items[0];
      if (this._items.length > 1) {
        this._items[0] = this._items.pop();
        this._sink(0);
      } else {
        this._items.length = 0;
      }
      return result;
    },

    _sink: function(n) {

      var item = this._items[n];
      var length = this._items.length;

      var child2N, swap, child1N, child1, child2, child1Score, child2Score;

      while (true) {

        child2N = (n + 1) * 2;
        child1N = child2N - 1;

        swap = null;

        if (child1N < length) {
          child1 = this._items[child1N];
          if (this._comp(child1, item) <= 0) {
            swap = child1N;
          }
        }

        if (child2N < length) {
          child2 = this._items[child2N];
          if (this._comp(child2, (swap === null) ? item : child1) <= 0)
            swap = child2N;
        }

        if (swap === null) {
          break;
        }

        this._items[n] = this._items[swap];
        this._items[swap] = item;
        n = swap;

      }
    },

    _bubble: function(n) {
      var item = this._items[n];
      var parentN, parent;
      while (n > 0) {
        parentN = Math.floor((n + 1) / 2) - 1;
        parent = this._items[parentN];
        if (this._comp(parent, item) <= 0) {
          break;
        }
        //swap
        this._items[parentN] = item;
        this._items[n] = parent;
        n = parentN;
      }
    }




  });

});