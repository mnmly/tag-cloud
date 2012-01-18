mongoose = require('./db_connect')
crypto = require('crypto')

Schema = mongoose.Schema

User = new Schema
  username:
    type: String
    required: true
  
  email:
    type: String
    default: ""
    required: true
  hashedPassword: String
  salt: String


User.virtual( 'password' )
  .set((password)->
    @_password = password
    @salt = @makeSalt()
    @hashedPassword = @encryptPassword(password)
  )
  .get -> @_password


User.method 'authenticate', (plainText)->
  @encryptPassword(plainText) is @hashedPassword


User.method 'makeSalt', ->
  Math.round((new Date().valueOf() * Math.random())) + ''


User.method 'encryptPassword', ( password )->
  crypto.createHmac('sha1', @salt).update(password).digest('hex')

exports = module.exports = mongoose.model("User", User)
