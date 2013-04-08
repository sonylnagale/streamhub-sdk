({
  paths: {
    jquery: 'lib/zepto/zepto',
    base64: 'lib/base64/base64',
    almond: 'lib/almond/almond',
    text: 'lib/requirejs-text/text',
    hogan: 'lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd',
    hgn: 'lib/requirejs-hogan-plugin/hgn'
  },
  packages: [{
     name: "streamhub-sdk",
     location: "src"
  }],
  shim: {
    jquery: {
        exports: '$'
    }
  },
  baseUrl: '.',
  name: "streamhub-sdk",
  include: ['almond'],
  stubModules: ['text', 'hgn'],
  //exclude: ['almond', 'jquery', 'base64'],
  out: "streamhub-sdk.built" + (process.env.VERSION && process.env.BUILD_ID ? process.env.VERSION + "-build." + process.env.BUILD_ID : "")  + ".js",
  pragmasOnSave: {
    excludeHogan: true
  },
  optimize: "uglify2",
  uglify2: {
    compress: {
      unsafe: true
    },
    mangle: true
  }
})
