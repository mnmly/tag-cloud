mongoose = require('./db_connect')

Schema = mongoose.Schema

Tag = new Schema
  tag: String
  size: Number
  count: Number

exports = module.exports = mongoose.model("Tag", Tag)
