mongoose = require('./db_connect')

Schema = mongoose.Schema

Product = new Schema

  createdBy:
    type: Schema.ObjectId
    ref: "User"
    required: true

  name:
    type: String
    default: ""
    required: true
  
  description:
    type: String
    default: ""
    required: true
  
  status:
    type: String
    required: true
  
  categories:[
    type: Schema.ObjectId
    ref: "Category"
    required: false
  ]

  prices:[
    type: Schema.ObjectId
    ref: "Price"
    required: false
  ]

  images: [
    type: Schema.ObjectId
    ref: "Image"
    required: false
  ]

  createdAt:
    type: Date
    default: Date.now
  
  updatedAt:
    type: Date
    default: Date.now

#Product::statusOptions = 

exports = module.exports = mongoose.model("Product", Product)
