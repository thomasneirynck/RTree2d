RTree2d
-------

A fast and memory-efficient 2D RTree implementation for Javascript. Supports range searches and nearest neighbour searches.

## Installation

The RTree is available as:
- script: **./release/js/RTree2d.js** (adds a global variable with the name `RTree2d`)
- an AMD module: **./release/js/RTree2d-amd.js**
- an CommonJS module: **./release/js/RTree2d-common.js**

## Demo

Take a test drive [here](http://rtree2d.hepburnave.com).

## At a glance

        var rtree = new RTree2d();

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

        //find the k nearest neighbours (x/y/k)
        var kNNArray = rtree.nearestNeighbours(0,0,1);

        //Number of elements in the tree.
        var size = rtree.size();

        //Remove an element.
        domainOb.remove(ob,2,3,4,5);


## Documentation

[API Documentation](http://rtree2d.hepburnave.com/jsdoc/)

## Code repository

[Git repo on bitbucket](https://github.com/hepburnave/RTree2d)

## Dev project setup

1) checkout repo

    > git clone https://bitbucket.org/trgn/rtree2d.git

2) run node setup script (might need admin priviliges on windows)

    > node setup.js

3) build a release

    > grunt release

