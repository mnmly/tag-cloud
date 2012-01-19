
  require.config({
    baseUrl: '/javascripts',
    priority: ["http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"],
    paths: {
      Tag: "tag-cloud/Tag",
      Rect: "tag-cloud/Rect",
      TagCloud: "tag-cloud/TagCloud",
      Evented: "tag-cloud/Evented",
      LoadingWheel: "loading-wheel"
    }
  });

  require(['app'], function(App) {
    return $(document).ready(function() {
      var animloop, app, count, loadInitialFont;
      window.app = app = new App(window.tweetData);
      count = 0;
      (animloop = function() {
        if ((!(app.loadingWheel != null)) || app.loadingWheel.doneLoading) return;
        requestAnimFrame(animloop);
        return app.loadingWheel.render(count++);
      })();
      loadInitialFont = function(data) {
        var t, text, _initial;
        text = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            t = data[_i];
            _results.push(t.tag);
          }
          return _results;
        })();
        _initial = fontPlusUtils.getFontForText('RodinPro-DB', text.join(''));
        return window.fontPlusUtils.bind('fontactive', function(_uid, fontFamily, fontDescription, text) {
          if (_initial === _uid) return app.trigger('onFontReady', fontFamily);
        });
      };
      app.bind('onFetchDone', function(data) {
        while (!(window.fontPlusUtils != null)) {
          1 + 1;
        }
        return loadInitialFont(data);
      });
      return require(['fontplus.utils', "https://ajax.googleapis.com/ajax/libs/webfont/1.0.24/webfont.js", 'http://webfont.fontplus.jp/accessor/script/fontplus.js?LyzUQoPX3yA%3D'], function(FontPlusUtils) {
        return window.fontPlusUtils = new FontPlusUtils(WebFont);
      });
    });
  });

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();
