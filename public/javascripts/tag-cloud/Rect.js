
  define(function() {
    var Rect;
    return Rect = (function() {

      function Rect(left, top, width, height) {
        this.left = left != null ? left : 0;
        this.top = top != null ? top : 0;
        this.width = width;
        this.height = height;
      }

      Rect.prototype.getCenter = function() {
        return [this.left + this.width / 2, this.top + this.height / 2];
      };

      Rect.prototype.rotate = function() {
        var rightTop, tempHeight;
        rightTop = [this.left + this.width, this.top];
        tempHeight = this.height;
        this.height = this.width;
        this.width = tempHeight;
        return this;
      };

      Rect.prototype.contains = function(rect) {
        var isInsideHorizontal, isInsideVertical;
        isInsideHorizontal = this.left < rect.left && this.left + this.width > rect.left + rect.width;
        isInsideVertical = this.top > rect.top && this.top + this.height > rect.top + rect.height;
        return isInsideVertical && isInsideHorizontal;
      };

      Rect.prototype.unionAll = function(rects) {
        var bottom, left, rect, right, top, _i, _len;
        left = this.left;
        top = this.top;
        right = this.width + this.left;
        bottom = this.height + this.top;
        for (_i = 0, _len = rects.length; _i < _len; _i++) {
          rect = rects[_i];
          left = Math.min(rect.left, left);
          top = Math.min(rect.top, top);
          right = Math.max(rect.left + rect.width, right);
          bottom = Math.max(rect.top + rect.height, bottom);
        }
        return new Rect(left, top, right - left, bottom - top);
      };

      Rect.prototype.collideRect = function(rect, getJoin) {
        if (getJoin == null) getJoin = false;
        return !(this.left > (rect.width + rect.left) || (this.width + this.left) < rect.left || this.top > (rect.top + rect.height) || (this.top + this.height) < rect.top);
      };

      Rect.prototype.inflate = function(offsetWidth, offsetHeight) {
        return new Rect(this.left - offsetWidth / 2, this.top - offsetHeight / 2, this.width + offsetWidth, this.height + offsetHeight);
      };

      Rect.prototype.copy = function() {
        return new Rect(this.left, this.top, this.width, this.height);
      };

      Rect.prototype.debugDiv = function(id) {
        var d;
        d = document.createElement('div');
        d.setAttribute('id', id);
        d.className = "debug";
        d.style.top = this.top + "px";
        d.style.left = this.left + "px";
        d.style.width = this.width + "px";
        d.style.height = this.height + "px";
        document.getElementById('stage').appendChild(d);
        return d;
      };

      return Rect;

    })();
  });
