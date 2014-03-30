define([
  /*modulepath*/"rtree2d/RTree"/*modulepath*/,
  "jquery"], function(RTree, jquery) {

  var context2d = document.getElementById('canv').getContext('2d');
  var obs = [];
  var draw = document.getElementById('draw');
  draw.onclick = show;

  var rtree;

  function show() {
    context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
    if (draw.checked && rtree.size() > 0) {
      context2d.canvas.style.visibility = 'visible';
      context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
      rtree.draw(context2d);
    }
  }


  function reset() {
    rtree = new RTree();
    context2d.canvas.width = document.getElementById('page').offsetWidth;
    show();
  }

  function randomNyInRange(from, to) {
    var l = to - from;
    return function() {
      return (Math.random() * l) + from;
    };
  }

  //wire reset.
  var resetb = document.getElementById('reset');
  resetb.onclick = reset;
  reset();


  jquery("[data-nr^=1]").click(function(event) {

    var nr = jquery(event.currentTarget).attr('data-nr');

    var total = parseInt(nr, 10);
    var boxwidth = 10;
    var anchorX = randomNyInRange(10, context2d.canvas.width - boxwidth - 10);
    var anchorY = randomNyInRange(10, context2d.canvas.height - boxwidth - 10);
    var size = randomNyInRange(0, boxwidth);

    function randomOb() {
      return {
        x: anchorX(),
        y: anchorY(),
        w: size(),
        h: size()
      };
    }


    obs.length = 0;
    var ob, i;
    for (i = 0; i < total; i += 1) {
      obs.push(randomOb());
    }

    //insertion. we measure time here.
    var start = new Date().getTime();
    for (i = 0; i < total; i += 1) {
      ob = obs[i];
      rtree.insert(ob, ob.x, ob.y, ob.w, ob.h);
    }
    var delta = (new Date().getTime()) - start;

    var message = ["Total time: " + (delta) + "ms",
      " Avg time per insert: " + delta / obs.length + "ms",
      "Total # insertions: " + obs.length,
      "Tree size: " + rtree.size()].join('<br/>');
    document.getElementById("message").innerHTML = message;

    show();
    window.show = show;

  });


  var searchMessage = jquery('#search');
  jquery(context2d.canvas).mousemove(function(event) {

    var parentOffset = jquery(this).parent().offset();
    var relX = event.pageX - parentOffset.left;
    var relY = event.pageY - parentOffset.top;

    var results = rtree.search(relX - 1, relY - 1, 2, 2);

    jquery(searchMessage).text(results.length + " results under the mouse pointer");

  });


});