require({
  baseUrl: '..',
  paths: {
    demo: "demo",
    jquery: 'bower_components/jquery/dist/jquery',
    rtree2d: "src"
  }
}, [
  "rtree2d/RTree",
  "jquery"], function(RTree, jquery) {


  var context2d = document.getElementById("canv").getContext("2d");

  function resize() {
    context2d.canvas.width = document.body.clientWidth;
    context2d.canvas.height = document.body.clientHeight;
  }

  window.addEventListener("resize", resize);
  resize();


  var rtree = new RTree();
  var results =[];
  var knn = [];
  var relX, relY;
  requestAnimationFrame(function paint() {
    requestAnimationFrame(paint);
    context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
    rtree.draw(context2d);

    context2d.lineWidth = 2;
    context2d.fillStyle = 'rgb(255,250,205)';
    context2d.strokeStyle = 'rgb(255,248,220)';

    results.forEach(function (result) {
      context2d.fillRect(result.x, result.y, result.w, result.h);
      context2d.strokeRect(result.x, result.y, result.w, result.h);
    });

    context2d.lineWidth = 2;
    context2d.strokeStyle = 'rgb(244,238,224)';
    knn.forEach(function (result) {

      context2d.beginPath();
      context2d.moveTo(relX, relY);
      context2d.lineTo(result.x + result.w / 2, result.y + result.h / 2);
      context2d.stroke();
    });

  });

  function spray(x, y) {
    var boxwidth = 20;
    var object = {
      x: x,
      y: y,
      w: randomInRange(0, 20),
      h: randomInRange(0, 20)
    };
    rtree.insert(object, object.x, object.y, object.w, object.h);
  }

  function randomInRange(from, to) {
    return (Math.random() * (to - from)) + from;
  }


  var down = false;
  jquery(context2d.canvas).mousedown(function () {
    down = true;
  });

  jquery(context2d.canvas).mouseup(function () {
    down = false;
  });


  jquery(context2d.canvas).mousemove(function (event) {

    var parentOffset = jquery(this).parent().offset();
    relX = event.pageX - parentOffset.left;
    relY = event.pageY - parentOffset.top;

    results = rtree.search(relX - 1, relY - 1, 2, 2);
    knn = rtree.nearestNeighbours(relX, relY, 10);

    if (!down) {
      return;
    }



    spray(relX, relY);


  });


//  var context2dBase = document.getElementById('canv').getContext('2d');
//  var obs = [];
//  var draw = document.getElementById('draw');
//  draw.onclick = show;
//
//  var context2dOverlay = document.getElementById('canvOverlay').getContext('2d');
//
//  var rtree;
//
//  function show() {
//    context2dBase.clearRect(0, 0, context2dBase.canvas.width, context2dBase.canvas.height);
//    if (draw.checked && rtree.size() > 0) {
//      context2dBase.canvas.style.visibility = 'visible';
//      context2dBase.clearRect(0, 0, context2dBase.canvas.width, context2dBase.canvas.height);
//      rtree.draw(context2dBase);
//    }
//  }
//
//
//  function reset() {
//    rtree = new RTree();
//    context2dBase.canvas.width = document.getElementById('page').offsetWidth;
//    context2dOverlay.canvas.width = context2dBase.canvas.width;
//    document.getElementById('map').style.width = context2dBase.canvas.width + "px";
//    document.getElementById('map').style.height = context2dBase.canvas.height + "px";
//    show();
//  }
//
//  function randomNrInRange(from, to) {
//    var l = to - from;
//    return function() {
//      return (Math.random() * l) + from;
//    };
//  }
//
//  //wire reset.
//  var resetb = document.getElementById('reset');
//  resetb.onclick = reset;
//  reset();
//
//
//  jquery("[data-nr^=1]").click(function(event) {
//
//    var nr = jquery(event.currentTarget).attr('data-nr');
//
//    var total = parseInt(nr, 10);
//    var boxwidth = 10;
//    var anchorX = randomNrInRange(10, context2dBase.canvas.width - boxwidth - 10);
//    var anchorY = randomNrInRange(10, context2dBase.canvas.height - boxwidth - 10);
//    var size = randomNrInRange(0, boxwidth);
//
//    function randomOb() {
//      return {
//        x: anchorX(),
//        y: anchorY(),
//        w: size(),
//        h: size()
//      };
//    }
//
//
//    obs.length = 0;
//    var ob, i;
//    for (i = 0; i < total; i += 1) {
//      obs.push(randomOb());
//    }
//
//    //insertion. we measure time here.
//    var start = new Date().getTime();
//    for (i = 0; i < total; i += 1) {
//      ob = obs[i];
//      rtree.insert(ob, ob.x, ob.y, ob.w, ob.h);
//    }
//    var delta = (new Date().getTime()) - start;
//
//    var message = ["Total time: " + (delta) + "ms",
//      " Avg time per insert: " + delta / obs.length + "ms",
//      "Total # insertions: " + obs.length,
//      "Tree size: " + rtree.size()].join('<br/>');
//    document.getElementById("message").innerHTML = message;
//    show();
//  });
//
//
//  var searchMessage = jquery('#search');
//  jquery(context2dOverlay.canvas).mousemove(function(event) {
//
//    var parentOffset = jquery(this).parent().offset();
//    var relX = event.pageX - parentOffset.left;
//    var relY = event.pageY - parentOffset.top;
//
//    var results = rtree.search(relX - 1, relY - 1, 2, 2);
//    var knn = rtree.nearestNeighbours(relX, relY, 10);
//
//    jquery(searchMessage).text(results.length + " results under the mouse pointer and " + " showing " + knn.length + " nearest neighbours");
//
//    context2dOverlay.clearRect(0, 0, context2dOverlay.canvas.width, context2dOverlay.canvas.height);
//
//    context2dOverlay.lineWidth = 1;
//    context2dOverlay.fillStyle = 'rgb(255,0,255,0.8)';
//    context2dOverlay.strokeStyle = 'rgb(255,0,255)';
//    results.forEach(function(result) {
//      context2dOverlay.fillRect(result.x, result.y, result.w, result.h);
//      context2dOverlay.strokeRect(result.x, result.y, result.w, result.h);
//    });
//
//    context2dOverlay.lineWidth = 2;
//    context2dOverlay.strokeStyle = 'rgb(0,255,255)';
//    knn.forEach(function(result) {
//      context2dOverlay.beginPath();
//      context2dOverlay.moveTo(relX, relY);
//      context2dOverlay.lineTo(result.x + result.w / 2, result.y + result.h / 2);
//      context2dOverlay.stroke();
//    });
//
//  });


});