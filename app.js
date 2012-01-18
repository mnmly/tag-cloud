(function() {
  var allowCrossDomain, app, auth, compile, express, nib, routes, stylus;

  express = require("express");

  routes = require("./routes");

  stylus = require('stylus');

  nib = require('nib');

  app = module.exports = express.createServer();

  auth = express.basicAuth('d', 'nonono');

  allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    return next();
  };

  compile = function(str, path) {
    return stylus(str).set("filename", path).set("compress", true).use(nib());
  };

  app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(app.router);
    app.use(stylus.middleware({
      src: __dirname + "/public",
      compile: compile
    }));
    return app.use(express.static(__dirname + "/public"));
  });

  app.configure("development", function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure("production", function() {
    return app.use(express.errorHandler());
  });

  app.get("/", auth, routes.index);

  app.get("/fetch", routes.fetch);

  app.listen(4010);

  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

}).call(this);
