(function() {
  var Tweets, cache, encoding, fs, mecab, startFetching, twit, twitter, twitterConfig;

  twitter = require('ntwitter');

  mecab = require('./../node_modules/node-mecab');

  Tweets = require('./../models/Tweets').Tweets;

  fs = require('fs');

  exports.index = function(req, res) {
    return res.render("index");
  };

  exports.user = function(req, res, next) {
    if (req.params.screenName.search(/\./) > -1) return next();
    return Tweets.findOne({
      screenName: req.params.screenName.toLowerCase()
    }, function(err, tweets) {
      if ((tweets != null) && tweets.tags.length > 0) {
        return res.render("index", {
          locals: {
            tweets: tweets.tags,
            screenName: req.params.screenName
          }
        });
      } else {
        return res.redirect('/');
      }
    });
  };

  exports.save = function(req, res) {
    return Tweets.findOne({
      screenName: req.params.n.toLowerCase()
    }, function(err, tweets) {
      var rectInfo;
      rectInfo = req.body.tags;
      rectInfo.forEach(function(r, i) {
        var rectObj;
        rectObj = {
          top: r.top,
          left: r.left,
          rotation: r.rotation,
          width: r.width,
          height: r.height,
          fontFamily: r.fontFamily,
          fontSize: r.fontSize
        };
        return tweets.tags[i].rect = rectObj;
      });
      return tweets.save(function() {
        return res.send({
          msg: 'Saved'
        });
      });
    });
  };

  twitterConfig = JSON.parse(fs.readFileSync(process.cwd() + "/config.json", encoding = "utf8")).twitter;

  twit = new twitter(twitterConfig);

  cache = [];

  startFetching = function(res, screenName, instance) {
    var twitterParams;
    twitterParams = {
      screen_name: screenName,
      exclude_replies: true,
      include_rts: false,
      count: 200,
      include_entities: false,
      contributor_details: false
    };
    return twit.getUserTimeline(twitterParams, function(err, data1) {
      if (err) return res.send(err);
      if (data1.length === 0) {
        return res.send({
          'msg': "No Tweets.."
        });
      }
      twitterParams.since_id = data1[data1.length - 1].id;
      return twit.getUserTimeline(twitterParams, function(err, data2) {
        var count, data, defScale, el, elementStore, elements, i, maxcount, maxsize, mincount, minsize, noun, store, t, tagItem, tweets, _i, _len, _len2, _ref;
        if (err) return res.send(err);
        data = data1.concat(data2);
        tweets = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            t = data[_i];
            _results.push(t.text);
          }
          return _results;
        })()).join(', ');
        tweets = tweets.replace(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi, '').replace(/\//gi, ' ').replace(/\#\w+/gi, ' ').replace(/RT\s@[\w\-\_\d]+\s?\:?/gi, ' ').replace(/^via/gi, ' ').replace(/\@\w+/gi, ' ').replace(/\-/gi, ' ').replace(/[\(\)\[\]]/gi, ' ').replace(/['"`:\.\|]/gi, ' ');
        elements = mecab.parse(tweets);
        elementStore = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (el[1] === '名詞') {
            if (elementStore[el[0]] != null) {
              elementStore[el[0]]++;
            } else {
              elementStore[el[0]] = 1;
            }
          }
        }
        store = [];
        for (noun in elementStore) {
          count = elementStore[noun];
          if (count > 1 && !(noun === 'の' || noun === 'ゆ' || noun === 'ら')) {
            store.push([noun, count]);
          }
        }
        store.sort(function(a, b) {
          return a[1] > b[1];
        });
        store.reverse();
        defScale = function(count, mincount, maxcount, minsize, maxsize) {
          return (0.5 + minsize + Math.pow((maxsize - minsize) * (count * 1.3 / (maxcount - mincount)), 0.98)) | 0;
        };
        maxcount = store[0][1];
        mincount = store[store.length - 1][1];
        minsize = 1;
        maxsize = 36;
        instance.tags = [];
        _ref = store.splice(0, 150);
        for (i = 0, _len2 = _ref.length; i < _len2; i++) {
          tagItem = _ref[i];
          instance.tags.push({
            tag: tagItem[0],
            size: defScale(tagItem[1], mincount, maxcount, minsize, maxsize),
            count: tagItem[1]
          });
        }
        return instance.save(function() {
          return res.send(instance.tags);
        });
      });
    });
  };

  exports.fetch = function(req, res) {
    var screenName;
    if (req.query.n == null) {
      return res.send({
        msg: "n is required"
      });
    } else {
      screenName = req.query.n.toLowerCase();
      return Tweets.findOne({
        screenName: screenName
      }, function(err, tweets) {
        var daysDiff, isTweetExists, timeDiff;
        if (tweets != null) {
          isTweetExists = true;
          timeDiff = new Date() - tweets.updatedAt;
          daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          if (tweets.tags.length === 0) {
            return startFetching(res, screenName, tweets);
          }
          if (daysDiff < 7) {
            if ((req.query.force != null) && req.query.force) {
              return Tweets.update({
                _id: tweets._id
              }, {
                $set: {
                  tags: []
                }
              }, function(err, uTweets) {
                return startFetching(res, screenName, tweets);
              });
            }
            return res.send(tweets.tags);
          } else {
            return startFetching(res, screenName, tweets);
          }
        } else {
          tweets = new Tweets();
          tweets.screenName = screenName;
          return tweets.save(function() {
            return startFetching(res, screenName, tweets);
          });
        }
      });
    }
  };

}).call(this);
