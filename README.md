RTree2d
-------

A fast and memory-efficient 2D RTree implementation for Javascript.

## Installation

The RTree is available as AMD package or node package.

### Node

todo

### Bower / AMD

todo


## Demo

Take a test drive [here](http://neirynck.us/rtree).

## Documentation

[API Documentation](http://neirynck.us/rtree/jsdoc)

## At a glance

    define(['package/RTree2d'], function(RTree2d){

        rtree = new RTree2d();

        //insert an object at the rectangle (x/y/width/height).
        var ob = {store: 'me'};
        rtree.insert(ob,2,3,4,5);

        //search a rectangle
        var results = rtree.search(0,0,10,10);
        //results ~= [{store: "me"}];


        //Instead of using search, you can also use one of the collection comprehension methods.
        //(e.g. you might be doing a search 60 frames-per-second. You do not want a new array each time).
        rtree.forEachinRectangle(0,0,10,10, function(ob){
            console.log("i got a hit,",ob);
        });

        //Number of elements in the tree.
        var size = rtree.size();

        //Remove an element.
        var newSizeOfTree = domainOb.remove(ob,2,3,4,5);

    });


##Dev project setup

todo