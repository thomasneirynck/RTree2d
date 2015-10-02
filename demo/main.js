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
      x: x - randomInRange(0,boxwidth/2),
      y: y - randomInRange(0,boxwidth/2),
      w: randomInRange(0, boxwidth),
      h: randomInRange(0, boxwidth)
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



});