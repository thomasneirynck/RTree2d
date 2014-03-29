define([
  './Rectangle'
], function(Rectangle) {


  function pushChild(ar, child) {
    ar.push(child);
    return ar;
  }

  function expand(acc, child) {
    var r = acc.r;
    var parent = acc.parent;
    r.include(child.l, child.b, child.r, child.t);
    if (!parent.contains(child.l, child.b, child.r, child.t)) {
      console.error('parent', r.toString(), 'child', child.toString());
      throw 'parent doesnt contain';
    }
    return acc;


  }

  return {

    __getChildren: function() {
      return this._foldChildren(pushChild, []);
    },

    __checkCount: function() {

      if (this.__getChildren().length !== this.size) {
        console.log('counts', this, " children-count + " + this.__getChildren().length + " vs size = " + this.size);
        throw 'child count vs size is not correct';
      }

      if (this.size > this.branchingFactor) {
        console.error('size is not correct', this, " brancing factor = " + this.branchingFactor + " vs size = " + this.size);
        throw 'size exceeds branching factor';
      }
    },

    __checkChildrendLinkedList: function() {

      var child = this.__firstChild;
      if (child && child.__previousSibling !== null) {
        console.error('first child should not have backref', this, child);
        throw 'First child should not have a backreference';
      }

      this.__getChildren().forEach(function(child) {
        if (child.__nextSibling && child !== child.__nextSibling.__previousSibling) {
          console.error('next back reference is not correct', child, child.__nextSibling);
          throw 'next back reference is not correct';
        }
        if (child.__previousSibling && child.__previousSibling.__nextSibling !== child) {
          console.error('next back reference is not correct', child, child.__previousSibling);
          throw 'prev back reference is not correct';
        }
      });

    },

    __checkBB: function() {

      var r = new Rectangle(this.l, this.b, this.w, this.h);
      r.reset();


      this._foldChildren(expand, {
        r: r,
        parent: this
      });


      if (!r.equals(this.l, this.b, this.r, this.t)) {
        console.error(this, this.__getChildren(), r.toString(), this.toString());
        throw 'doesnt fit snug';
      }


    },

    __validateChildren: function() {
      this.__getChildren().forEach(function(chlid) {
        chlid.__validate() && chlid.__validate();
      });
    },

    __validate: function() {

      this.__checkCount();
      this.__checkChildrendLinkedList();
      this.__checkBB();

      this.__validateChildren();

    }

  }
});