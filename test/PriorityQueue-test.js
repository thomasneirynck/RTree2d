define([
  'rtree/PriorityQueue'
], function(PriorityQueue) {

  module("PriorityQueue");

  test("constructor", function() {


    var pq = new PriorityQueue(function(a, b) {
      return a - b;
    });

    equal(pq.size(), 0, "should be empty at start");

  });

  test("enqueue/dequeue", function() {


    var pq = new PriorityQueue(function(a, b) {
      return a - b;
    });

    pq.enqueue(1);
    equal(pq.size(), 1);
    var res = pq.dequeue();
    equal(pq.size(), 0);
    equal(res, 1);


  });

  test("enqueue/dequeue (m)", function() {


    var pq = new PriorityQueue(function(a, b) {
      return a - b;
    });

    pq.enqueue(1);
    pq.enqueue(2);
    equal(pq.size(), 2);

    var res = pq.dequeue();
    equal(pq.size(), 1);
    equal(res, 1);

    res = pq.dequeue();
    equal(pq.size(), 0);
    equal(res, 2);

    pq.enqueue(10);
    pq.enqueue(2);
    pq.enqueue(100);
    pq.enqueue(-2);

    equal(pq.dequeue(), -2);
    equal(pq.dequeue(), 2);
    equal(pq.dequeue(), 10);
    equal(pq.dequeue(), 100);
    equal(pq.size(), 0);

  });


});