RTree2d
-------

A fast and memory-efficient 2D RTree implementation for Javascript. Supports range searches and neirest neighbour searches.

## Installation

The RTree is available as an AMD package or a node package.

### Bower / AMD

Use bower to install the AMD modules straigh from the source

    > bower install https://bitbucket.org/trgn/rtree2d.git

The modules are located under 'src'.

Your path config would look something like...

    require.config({
        ...
        paths: {
           ...
           package: "%PATH_TO_BOWER_COMPONENTS%/RTree2d/src"
           ...
        }
        ...
    })


### Node

Use the node package manager to install the module

    > npm install rtree2d

## Demo

Take a test drive [here](http://neirynck.us/rtree).

## At a glance

    define(['package/RTree2d'], function(RTree2d){

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
        var newSizeOfTree = domainOb.remove(ob,2,3,4,5);

    });

## Documentation

[API Documentation](http://neirynck.us/rtree/jsdoc)

### Code repository

[Git repo on bitbucket](https://bitbucket.org/trgn/rtree2d)

##Dev project setup

1) checkout repo

    > git clone https://bitbucket.org/trgn/rtree2d.git

2) run node setup script (might need admin priviliges on windows)

    > node setup.js

3) build a release

    > "./node_modules/.bin/jake" -f build.js release

