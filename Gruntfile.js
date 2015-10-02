var async = require("async");
var buildify = require('buildify');

var releaseDir = "./release/";

var srcDir = "./src/";
var RTreeModule = srcDir + "RTree";

module.exports = function (grunt) {

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      source: [
        srcDir,
        "demo"
      ]
    },
    clean: {
      release: [
        releaseDir
      ]
    },
    requirejs: {

      rtree2d: {
        options: {
          baseUrl: ".",
          mainConfigFile: "src/RTree" + ".js",
          name: "bower_components/almond/almond.js",
          include: "src/RTree",
          out: releaseDir + "js/RTree2d.js",
          optimize: "uglify2",
          options: {
            mangle: true
          },
          wrap: {
            start: "(function(root) {",
            end: "root.RTree2d = require('src/RTree');}(this));"
          }
        }
      }
    },

    compress: {
      main: {
        options: {
          archive: function () {
            return "release/rtree2d.zip"
          }
        },
        files: [
          {cwd: "release/js", src: ["**"], dest: "js", filter: 'isFile', expand: true}
        ]
      }
    }
  });


  grunt.registerTask("amdify", function () {

    buildify()
      .load("release/js/RTree2d.js")
      .perform(function (contents) {

        contents =
          "(function(){var scope = this;" +
          contents +
          "define([],function(){ return scope.RTree2d; });}).call({});";

        return contents;

      })
      .save("release/js/RTree2d-amd.js");


  });

  grunt.registerTask("commonjsify", function () {

    buildify()
      .load("release/js/RTree2d.js")
      .perform(function (contents) {

        contents =
          "(function(){var scope = this;" +
          contents +
          "exports.RTree2d=scope.RTree2d;}).call({});";

        return contents;

      })
      .save("release/js/RTree2d-common.js");

  });


  grunt.registerTask("release", ["jshint", "requirejs", "amdify", "commonjsify", "compress"]);

};
