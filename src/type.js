define([], function() {

  "use strict";

  function mixin(destination) {
    var sources = Array.prototype.slice.call(arguments, 1);
    sources.forEach(function(source) {
      for (var i in source) {
        if (source.hasOwnProperty(i)) {
          destination[i] = source[i];
        }
      }
    });
    return destination;
  }


  return function(prototype) {

    var mixins, proto;
    try {
      mixins = (arguments.length > 1) ? [Object.create(prototype)].concat(Array.prototype.slice.call(arguments, 1)) :
               [
                 {},
                 prototype
               ];
      proto = mixin.apply(null, mixins);

      //ensure 2-way binding (so an object's constructor and that constructor's prototype match)
      proto.constructor.prototype = proto;

    } catch (e) {
      console.error("type: Cannot make constructor function and prototype with ", arguments);
      throw e;
    }
    return proto.constructor;

  };

});