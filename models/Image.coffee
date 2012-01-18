mongoose = require('./db_connect')
Schema = mongoose.Schema

Image = new Schema
  url: String
  digest: String
  title: String
  description: String
  createdBy:
    type: Schema.ObjectId
    ref: "User"
    required: true

exports = module.exports = mongoose.model("Image", Image)
