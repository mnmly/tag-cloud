mongoose = require('./db_connect')
Schema = mongoose.Schema

Price = new Schema
  name: String
  price: String


exports = module.exports = mongoose.model("Price", Price)
