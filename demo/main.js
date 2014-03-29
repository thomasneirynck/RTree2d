define([
  /*modulepath*/"rtree2d/RTree"/*modulepath*/,
  "jquery"], function(RTree, jquery) {

  var context2d = document.getElementById('canv').getContext('2d');
  var obs = [];
  var draw = document.getElementById('draw');
  draw.onclick = show;

  function show() {
    if (draw.checked && tree.size() > 0) {
      context2d.canvas.style.visibility = 'visible';
      context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
      tree.draw(context2d);
    } else {
      context2d.canvas.style.visibility = 'hidden';
    }
  }


  function reset() {
    tree = new RTree();
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
      tree.insert(ob, ob.x, ob.y, ob.w, ob.h);
    }
    var delta = (new Date().getTime()) - start;

    var message = ["Total time: " + (delta) + "ms",
      " Avg time per insert: " + delta / obs.length + "ms",
      "Total # insertions: " + obs.length,
      "Tree size: " + tree.size()].join('<br/>');
    document.getElementById("message").innerHTML = message;

    show();
    window.show = show;

  });
//
//
//  var search = document.getElementById('search');
//  search.onclick = function() {
//
//
//    var total = nr.options[nr.selectedIndex].value;
//    var boxdim = 100;
//    var anchorX = genRandom(10, context2d.canvas.width - boxdim - 10);
//    var anchorY = genRandom(10, context2d.canvas.height - boxdim - 10);
//    var size = genRandom(0, boxdim);
//
//    function randomSearchOb() {
//      var a = {};
//      a.x = anchorX();
//      a.y = anchorY();
//      var size = genRandom(0, 30);
//      a.w = size();
//      a.h = size();
//      return a;
//    }
//
//    //create some search objes
//    var totalsearches = 10000;
//    var searches = [];
//    var i;
//    for (i = 0; i < totalsearches; i += 1) {
//      searches[i] = randomSearchOb();
//    }
//
//
//    var count = 0;
//    var countHits = function(it) {
//      count += 1;
//    };
//
//    var bef = Date.now();
//    var search;
//    for (i = 0; i < totalsearches; i += 1) {
//      search = searches[i];
//      tree.forEachInRectangle(search.x, search.y, search.w, search.h, countHits);
//    }
//    var delta = Date.now() - bef;
//    var message = [
//      'Total search time: ' + delta,
//      'Avg time per search: ' + delta / totalsearches,
//      'Avg number of results per search: ' + (count / totalsearches),
//      'Tree size: ' + tree.size()
//    ].join('<br/>');
//    document.getElementById('message').innerHTML = message;
//
//
//  };


});