(function() {
  var Surface;

  Surface = (function() {

    function Surface(width, height) {
      this.width = width;
      this.height = height;
    }

    Surface.prototype.getRect = function() {
      return this.rect;
    };

    return Surface;

  })();

}).call(this);
