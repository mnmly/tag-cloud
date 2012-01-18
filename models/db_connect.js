(function() {
  var encoding, environment, exports, fs, mongo_uri, mongoose;

  fs = require("fs");

  exports = mongoose = require("mongoose");

  environment = process.env.NODE_ENV || "development";

  mongo_uri = JSON.parse(fs.readFileSync(process.cwd() + "/config.json", encoding = "utf8"))[environment].mongo_uri;

  mongoose.connect(mongo_uri);

  module.exports = mongoose;

}).call(this);
