var sys = require('sys');
var exec = require('child_process').exec;
var fs = require('fs');
var nodefy = require('nodefy');
var ncp = require('ncp').ncp;
var docco = require('docco');
var rimraf = require('rimraf');
var buildify = require('buildify');


var RELEASE_DIR = '../release/';
var NODE_DIR = RELEASE_DIR + 'node/';

var addGoogleAnalytics = function(content) {
  var nb = buildify();
  var ga = nb
    .load('./parts/googleAnalytics.frag')
    .content;
  return content.replace('</head>', ga + "</head>");
};

var addLicense = function(content) {
  var nb = buildify();
  var lic = nb
    .load('./parts/mitlicense.frag')
    .content;

  return lic + content;
};

function copy(from, to) {
  fs
    .createReadStream(from)
    .pipe(fs.createWriteStream(to));
}

desc('setup');
task('setup', function() {
  fs.mkdir(RELEASE_DIR, function() {
    console.log('made release dir');
    complete();
  });


}, true);

desc('build node package');
task('nodeModule', ['setup'], function() {

  nodefy.batchConvert('../src/*.js', NODE_DIR, function(err, results) {
    if (err) {
      console.log('node failed.', err);
      return;
    }
    copy('./node-package.json', NODE_DIR + 'package.json');
    copy('../README.md', NODE_DIR + 'README.md');
    complete();
  });

});


desc('build jsdoc');
task('jsdoc', ['setup'], function() {

  //build jsdoc
  exec('"../node_modules/.bin/jsdoc" ../src/ ../README.md -d ../release/jsdoc -t "./jsdoctemplate"', function(err, stdout, sterr) {

    if (err || sterr) {
      console.log('jsdoc failed.', err, sterr);
    }

    var b = buildify();
    b
      .load('../release/jsdoc/index.html')
      .perform(addGoogleAnalytics)
      .save('../release/jsdoc/index.html');

    complete();

  });

}, true);

desc('build demo');
task('demo', ['setup'], function() {


  exec('node ../node_modules/requirejs/bin/r.js -o amd-profile-demo.js', function(err, stdout, sterr) {

    if (err || sterr) {
      console.error('demo minification failed.', err);
      return;
    }

    var b = buildify();
    b
      .load("../release/index.html")
      .perform(function(content) {
        content = content.replace(/.*<!--amdloader-->(.*?)\<!--amdloader-->/g, '<script type="text/javascript" src="./require.js"></script>');
        content = content.replace(/.*<!--bootstrap-->(.*?)\<!--bootstrap-->/g, '<script type="text/javascript" src="./main.js"></script>');
        return content;
      })
      .save("../release/index.html");

        //add ga
    b = buildify();
    b
      .load("../release/index.html")
      .perform(addGoogleAnalytics)
      .save("../release/index.html");

    b = buildify();
    b
      .load("../release/main.js")
      .perform(addLicense)
      .save("../release/main.js");

    b = buildify();
    b
      .load("../bower_components/requirejs/require.js")
      .save("../release/require.js");

    complete();

  });



}, true);


desc('build release');
task('release', ['demo','jsdoc','nodeModule']);


