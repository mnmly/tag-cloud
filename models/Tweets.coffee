mongoose = require('./db_connect')

Schema = mongoose.Schema

Tag = new Schema
  tag: String
  size: Number
  count: Number

Tweets = new Schema

  screenName:
    type: String
    required: true
  
  tags:[ Tag ]

  updatedAt:
    type: Date
    default: Date.now

exports = module.exports = mongoose.model("Tweets", Tweets)
