/*
 * installs the required node modules and bower dependencies.
 * These are required for to build the package and run the demo.
 */

var exec = require('child_process').exec;

function log(err, stdout, sterr) {
  if (err) {
    console.error(arguments);
  } else {
    console.log(arguments);
  }
}

exec('npm install nodefy', log);
exec('npm install jsdoc', log);
exec('npm install docco', log);
exec('npm install ncp', log);
exec('npm install rimraf', log);
exec('npm install jake', log);
exec('npm install markdown', log);
exec('npm install buildify', log);
exec('npm install requirejs', log);//just so we get r.js minimizer. also included with bower

exec('npm install bower', function(err, out) {
  if (err) {
    console.error("Could not install bower");
    return;
  }

  console.log('installing bower dependencies...');
  exec('"node_modules/.bin/bower" install', log);

});





