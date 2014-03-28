define(['./type'], function(type) {

  return type({

    constructor: function(x, y, w, h) {
      this.l = x;
      this.b = y;
      this.r = x + w;
      this.t = y + h;
      this.w = w;
      this.h = h;
      this.area = w * h;
    },

    toString: function() {
      return '[' + [this.l, this.b, this.w, this.h].join(',') + ']';
    },
    equals: function(l, b, r, t) {
      return (r === this.r && t === this.t && l === this.l && b === this.b);
    },
    contains: function(l, b, r, t) {
      return (r <= this.r && t <= this.t && l >= this.l && b >= this.b);
    },
    draw: function(context) {
      context.strokeStyle = 'rgba(0,0,0,1)';
      context.strokeRect(this.l, this.b, this.w, this.h);
    },

    include: function(l, b, r, t) {
      this.l = (this.l < l) ? this.l : l;
      this.b = (this.b < b) ? this.b : b;
      this.r = (this.r > r) ? this.r : r;
      this.t = (this.t > t) ? this.t : t;
      this.w = this.r - this.l;
      this.h = this.t - this.b;
      this.area = this.w * this.h;
    },

    copy: function() {
      return new this.constructor(this.l, this.b, this.w, this.h);
    },

    reset: function() {
      this.l = Infinity;
      this.r = -Infinity;
      this.b = Infinity;
      this.t = -Infinity;
      this.w = 0;
      this.h = 0;
      this.area = 0;
    },

    expansionCost: function(l, b, r, t) {
      l = (this.l < l) ? this.l : l;
      b = (this.b < b) ? this.b : b;
      r = (this.r > r) ? this.r : r;
      t = (this.t > t) ? this.t : t;
      return ((r - l) * (t - b)) - this.area;
    },

    interacts: function(l, b, r, t) {
      return (this.l <= r && this.r >= l && this.b <= t && this.t >= b);
    }
  });


});