#phraser = require('./lib/phrasar')
twitter = require('ntwitter')
mecab = require('./../node_modules/node-mecab')
Tweets = require('./../models/Tweets').Tweets

exports.index = (req, res) ->
  res.render "index"

exports.user = (req, res, next) ->
  if req.params.screenName.search(/\./) > -1
    return next()
  Tweets.findOne {screenName: req.params.screenName.toLowerCase()}, (err, tweets)->
    if tweets? and tweets.tags.length > 0
      res.render "index",
        locals:
          tweets: tweets.tags
          screenName: req.params.screenName
    else
      res.redirect('/')

exports.save = (req, res) ->
  Tweets.findOne {screenName: req.params.n.toLowerCase()}, (err, tweets)->
    rectInfo = req.body.tags
    rectInfo.forEach (r, i)->
      rectObj =
        top: r.top
        left: r.left
        rotation: r.rotation
        width: r.width
        height: r.height
        fontFamily: r.fontFamily
        fontSize: r.fontSize
      tweets.tags[i].rect = rectObj
    
    tweets.save ->
      console.log tweets.tags[0].rect
      res.send
        msg: 'Saved'


twit = new twitter
  consumar_key: "79DmvBwydqEd5PfqZkOVg"
  consumer_secret: 'VfhqcffJJa4Gic12CAO4sbs9gOs9dX4FeHIrSMJRUvE'
  access_token_key: '15055740-dpoGKeXm5rqRQN2LOA9GqbVhuaMV7TFEWCMCRiyj4'
  access_token_secret: '7D6clBZQf2UDF6Os4aoWqoOPvZ5pSqtMeYdr6F8'

cache = []

startFetching = (res, screenName, instance)->

  twitterParams =
    screen_name: screenName
    exclude_replies: true
    include_rts: no
    count: 200
    include_entities: no
    contributor_details: no

  twit.getUserTimeline twitterParams, (err, data1) ->
    return res.send err  if err
    if data1.length is 0
      return res.send
        'msg': "No Tweets.."

    twitterParams.since_id = data1[data1.length - 1].id
      
    twit.getUserTimeline twitterParams, (err, data2)->

      return res.send err  if err

      data = data1.concat(data2)
      tweets = ( t.text for t in data ).join(', ')
      tweets = tweets
        .replace(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi, '' )
        .replace(/\//gi, ' ')
        .replace(/\#\w+/gi, ' ')
        .replace(/RT\s@[\w\-\_\d]+\s?\:?/gi, ' ')
        .replace(/^via/gi, ' ')
        .replace(/\@\w+/gi, ' ')
        .replace(/\-/gi, ' ')
        .replace(/[\(\)\[\]]/gi, ' ')
        .replace(/['"`:\.\|]/gi, ' ')
      
      elements = mecab.parse tweets
      elementStore = []

      for el in elements
        if el[1] is '名詞'
          if elementStore[el[0]]?
            elementStore[el[0]]++
          else
            elementStore[el[0]] = 1
      
      store = []
      for noun, count of elementStore
        
        if count > 1 and not ( noun in ['の', 'ゆ', 'ら'] )
          store.push [ noun, count ]
      
      store.sort (a, b)->
        a[1] > b[1]

      store.reverse()
      
      defScale = (count, mincount, maxcount, minsize, maxsize)->
        return ( 0.5 + minsize + Math.pow( (maxsize - minsize) * ( count * 1.3 / ( maxcount - mincount )), 0.98 ) ) | 0
      
      maxcount = store[0][1]
      mincount = store[store.length - 1][1]
      minsize = 1
      maxsize = 36
      instance.tags = []
        
      for tagItem, i in store.splice(0, 100)
        instance.tags.push
          tag: tagItem[0]
          size: defScale( tagItem[1], mincount, maxcount, minsize, maxsize )
          count: tagItem[1]

      instance.save ->
        res.send instance.tags

  
exports.fetch = (req, res) ->
  unless req.query.n?
    res.send
      msg: "n is required"
  else
    screenName = req.query.n.toLowerCase()
    Tweets.findOne {screenName: screenName}, (err, tweets)->
      if tweets?
        isTweetExists = yes
        timeDiff = new Date() - tweets.updatedAt
        daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
        # Go to twittter if it is below 7 days
        if tweets.tags.length is 0
          return startFetching(res, screenName, tweets)
        
        
        if daysDiff < 7
          if req.query.force? and req.query.force
            return Tweets.update _id: tweets._id, {$set: tags: []}, (err, uTweets)->
              return startFetching(res, screenName, tweets)
          res.send tweets.tags
        else
          return startFetching(res, screenName, tweets)
      else
        tweets = new Tweets()
        tweets.screenName = screenName
        tweets.save ->
          startFetching(res, screenName, tweets)

#console.log phraser(sentence)
