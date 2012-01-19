mongoose = require('./db_connect')

Schema = mongoose.Schema

Tag = new Schema
  tag: String
  size: Number
  count: Number
  rect:
    top: Number
    left: Number
    rotation: Number
    width: Number
    height: Number
    fontFamily: String
    fontSize: Number

Tweets = new Schema

  screenName:
    type: String
    required: true
  
  tags:[ Tag ]
  
  updatedAt:
    type: Date
    default: Date.now

exports.Tweets = module.exports.Tweets = mongoose.model("Tweets", Tweets)
