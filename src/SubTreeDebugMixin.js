define([
  './Rectangle'
], function(Rectangle) {


  return {

    __children: function() {
      var ch = [];
      var child = this.__firstChild;
      while (child) {
        ch.push(child);
        child = child.__nextSibling;
      }
      return ch;
    },

    __checkCount: function() {
      var child = this.__firstChild;
      var c = 0;
      while (child) {
        c += 1;
        child = child.__nextSibling;
      }
      if (c !== this.size) {
        throw 'count is not correct';
      }

      if (this.size > this.branchingFactor) {
        throw 'childs exceed branching facor';
      }
    },

    __checkChildrendLinkedList: function() {
      var child = this.__firstChild;
      if (child && child.__previousSibling !== null) {
        console.log('first child should not have backref', child);
        throw 'First child should not have a backreference';
      }

      while (child) {
        if (child.__nextSibling && child !== child.__nextSibling.__previousSibling) {
          console.log('next back reference is not correct');
          throw 'next back reference is not correct';
        }
        if (child.__previousSibling && child.__previousSibling.__nextSibling !== child) {
          console.log('previous forward reference is not correct');
          throw 'prev back reference is not correct';
        }
        child = child.__nextSibling;
      }
    },

    __checkBB: function() {

      var r = new Rectangle(this.l, this.b, this.w, this.h);
      r.reset();

      var child = this.__firstChild;
      while (child) {
        r.include(child.l, child.b, child.r, child.t);
//        if (!this.contains(child.l, child.b, child.r, child.t)) {
//          console.log('parent', this.toString(), 'child', child.toString());
//          throw 'parent doesnt contain';
//        }
        child = child.__nextSibling;
      }
      if (!r.equals(this.l, this.b, this.r, this.t)) {
        console.log(r.toString(), this.toString());
        ch = this.__children();
        pa = this;
        ra = r;
        throw 'doesnt fit snug';
      }
    },

    __checkChildren: function() {
      var child = this.__firstChild;
      while (child) {
        child.__validate && child.__validate();
        child = child.__nextSibling
      }
    },

    __validate: function() {

      this.__checkCount();
      this.__checkChildrendLinkedList();
      this.__checkBB();

      this.__checkChildren();

    }

  }
});