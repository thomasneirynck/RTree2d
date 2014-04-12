({
  appDir: '../demo',
  baseUrl: '.',
  dir: '../release',
  modules: [
    {
      name: 'main'
    }
  ],
  fileExclusionRegExp: /^(r|build|amd|run|amd).*\.js$/,
  optimizeCss: 'standard',
  removeCombined: true,
  paths: {
    jquery: '../bower_components/jquery/dist/jquery',
    rtree2d: "../src"
  }
})
