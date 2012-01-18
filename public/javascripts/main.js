
  require.config({
    baseUrl: '/javascripts',
    priority: ["http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"],
    paths: {
      Tag: "tag-cloud/Tag",
      Rect: "tag-cloud/Rect",
      TagCloud: "tag-cloud/TagCloud",
      Evented: "tag-cloud/Evented"
    }
  });

  require(['app', 'loading-wheel'], function(App, LoadingWheel) {
    return $(document).ready(function() {
      var animloop, app, count, loadingWheel;
      app = new App;
      loadingWheel = new LoadingWheel;
      count = 0;
      return (animloop = function() {
        requestAnimFrame(animloop);
        return loadingWheel.render(count++);
      })();
    });
  });

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();
