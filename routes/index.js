(function() {
  var cache, mecab, twit, twitter;

  twitter = require('ntwitter');

  mecab = require('./../node_modules/node-mecab');

  exports.index = function(req, res) {
    return res.render("index");
  };

  twit = new twitter({
    consumar_key: "79DmvBwydqEd5PfqZkOVg",
    consumer_secret: 'VfhqcffJJa4Gic12CAO4sbs9gOs9dX4FeHIrSMJRUvE',
    access_token_key: '15055740-dpoGKeXm5rqRQN2LOA9GqbVhuaMV7TFEWCMCRiyj4',
    access_token_secret: '7D6clBZQf2UDF6Os4aoWqoOPvZ5pSqtMeYdr6F8'
  });

  cache = [];

  exports.fetch = function(req, res) {
    var twitterParams;
    if (cache.length > 0) return res.send(cache);
    if (req.query.n != null) {
      twitterParams = {
        screen_name: req.query.n,
        exclude_replies: true,
        include_rts: false,
        count: 200,
        include_entities: false,
        contributor_details: false
      };
    } else {
      res.send({
        msg: "n is required"
      });
    }
    return twit.getUserTimeline(twitterParams, function(err, data1) {
      if (err) return res.send(err);
      twitterParams.since_id = data1[data1.length - 1].id;
      return twit.getUserTimeline(twitterParams, function(err, data2) {
        var count, data, defScale, el, elementStore, elements, maxcount, maxsize, mincount, minsize, noun, store, t, tagItem, tags, tweets, _i, _j, _len, _len2, _ref;
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
        tweets = tweets.replace(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi, '').replace(/\//gi, ' ').replace(/\#\w+/gi, ' ').replace(/RT\s@[\w\-\_\d]+\s?\:?/gi, ' ').replace(/^via/gi, ' ').replace(/\@\w+/gi, ' ').replace(/\-/gi, ' ');
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
        tags = [];
        maxcount = store[0][1];
        mincount = store[store.length - 1][1];
        minsize = 1;
        maxsize = 36;
        _ref = store.splice(0, 300);
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          tagItem = _ref[_j];
          tags.push({
            tag: tagItem[0],
            size: defScale(tagItem[1], mincount, maxcount, minsize, maxsize)
          });
        }
        cache = tags;
        return res.send(tags);
      });
    });
  };

}).call(this);
