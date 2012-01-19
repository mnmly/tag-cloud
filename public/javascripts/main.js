
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
      var animloop, app, count;
      window.app = app = new App(window.tweetData);
      count = 0;
      return (animloop = function() {
        if ((!(app.loadingWheel != null)) || app.loadingWheel.doneLoading) return;
        requestAnimFrame(animloop);
        return app.loadingWheel.render(count++);
      })();
    });
  });

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();
