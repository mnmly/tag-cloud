mongoose = require('./db_connect')
Schema = mongoose.Schema


Category = new Schema
  name:
    type: String
    required: true

  createdBy:
    type: Schema.ObjectId
    ref: "User"
    required: true
  
exports = module.exports = mongoose.model("Category", Category)
