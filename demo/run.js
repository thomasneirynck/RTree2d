require({
  baseUrl: '..',
  shim: {
    "jQueryUI": {
      export: "$",
      deps: ['jquery']
    }
  },
  paths: {
    demo: "demo",
    jquery: 'bower_components/jquery/dist/jquery',
    rtree2d: "src"
  }
}, ["demo/main"]);
