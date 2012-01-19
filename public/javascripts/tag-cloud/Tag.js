
  define(['Rect'], function(Rect) {
    var Tag;
    return Tag = (function() {
      var count, leftMost, topMost;

      count = 0;

      leftMost = 0;

      topMost = 0;

      Tag.makeTagFromJSON = function(tag, size, tagData) {
        var t;
        t = new Tag(tag, size, tagData.rotation, tagData.fontFamily);
        t.fontSize = tagData.fontSize;
        t.rect = new Rect();
        t.rect.width = tagData.width;
        t.rect.height = tagData.height;
        t.rect.top = tagData.top;
        return t.rect.left = tagData.left;
      };

      function Tag(tag, size, rotation, fontName, fontZoom) {
        this.tag = tag;
        this.size = size;
        this.rotation = rotation;
        this.fontName = fontName != null ? fontName : "AXIS Std";
        this.fontZoom = fontZoom != null ? fontZoom : 2.5;
        if (count++ === 0) {
          Tag.stage = document.getElementById('stage');
          Tag.hitTestCanvas = document.getElementById('hit-test');
          Tag.stylesheet = document.createElement('style');
          document.head.appendChild(Tag.stylesheet);
        }
        this.cid = "t-" + count;
        this.el = document.createElement('span');
        this.el.setAttribute('id', this.cid);
        this.el.innerText = this.tag;
        this.el.className = 'tag not-yet';
        this.el.style.fontSize = this.size * this.fontZoom + 'px';
        this.el.style.fontFamily = "'" + this.fontName + "', Helvetica";
        Tag.stage.appendChild(this.el);
        this.rect = new Rect;
        this.rect.width = this.el.offsetWidth + 1;
        this.rect.height = this.size * this.fontZoom;
        if (this.rotation === 90) this.rect.rotate();
        this;
      }

      Tag.prototype.update = function(opacity) {
        var $el, left, pos, randomLeft, randomTop, rule, stage, stageWidth, top;
        var _this = this;
        if (opacity == null) opacity = 1;
        rule = Tag.stylesheet.innerHTML;
        top = (0.5 + this.rect.top) | 0;
        left = (0.5 + this.rect.left) | 0;
        $el = $(this.el);
        $el.data('tag', this);
        stage = document.getElementById('stage');
        stageWidth = stage.offsetWidth / 2;
        if (left < stageWidth / 2) {
          randomLeft = Math.random() * stageWidth / 2 - 200;
        } else {
          randomLeft = stageWidth / 2 + Math.random() * stageWidth / 2 + 200;
        }
        randomTop = -Math.random() * 200;
        if (leftMost < left) leftMost = left;
        if (topMost > top) topMost = top;
        if (this.rotation === 90) {
          pos = {
            left: left + this.rect.width,
            top: top
          };
        } else {
          pos = {
            left: left,
            top: top
          };
        }
        rule += "#" + this.cid + ".tag{\n  top: -100px;\n  font-size: " + (this.fontZoom * this.size) + "px;\n  font-size: " + (this.fontZoom * this.size / 10) + "rem;\n  height: " + (this.fontZoom * this.size) + "px;\n  width: " + this.el.offsetWidth + "px;\n  color: black; /*" + (this.randomColor(1, 72, 155)) + ";*/\n  -webkit-transform: rotate(60deg) skew(0deg, -30deg) scale(1, 1.16) translate3d(" + pos.left + "px, " + pos.top + "px, 0px) " + (this.rotation === 90 ? "rotate(90deg)" : "") + ";\n  opacity: 0;\n}\n#" + this.cid + ".tag.ready{\n  top: 0px;\n  opacity: 1;\n}\n#stage.normal-view #" + this.cid + ".tag{\n  -webkit-transform: translate3d(" + pos.left + "px, " + pos.top + "px, 0px) " + (this.rotation === 90 ? "rotate(90deg)" : "") + ";\n  transform: scale(1, 1.16) translate(" + pos.left + "px, " + pos.top + "px, 0px) " + (this.rotation === 90 ? "rotate(90deg)" : "") + ";\n}\n\n";
        Tag.stylesheet.innerHTML = rule;
        $el.append("<span>" + this.tag + "</span>");
        setTimeout(function() {
          return _this.el.className = 'tag ready';
        }, 500);
        return {
          top: topMost,
          left: leftMost
        };
      };

      Tag.prototype.flip = function() {
        return this.el.style.webkitTransform = "scale(1, -1) rotate(" + this.rotation + "deg)";
      };

      Tag.prototype.randomColor = function(r, b, g) {
        var blue, green, red;
        red = (0.5 + Math.random() * 256) | 0;
        green = (0.5 + Math.random() * 256) | 0;
        blue = (0.5 + Math.random() * 256) | 0;
        red = (red + r) / 2;
        green = (green + g) / 2;
        blue = (blue + b) / 2;
        return "rgb( " + ((0.5 + red) | 0) + ", " + ((0.5 + green) | 0) + ", " + ((0.5 + blue) | 0) + " )";
      };

      Tag.prototype.collideWith = function(tag, doMask) {
        var ctx, dA, dB, data, hitTestCanvas, i, intersects, isOpaque, pixelData, pixels, stage, translateLeftThat, translateLeftThis, translateTopThat, translateTopThis;
        if (doMask == null) doMask = false;
        if (!doMask) {
          return this.rect.collideRect(tag.rect);
        } else {
          if (this.rect.collideRect(tag.rect)) {
            this.debug = false;
            if (this.debug) {
              this.update(.5);
              tag.update(.5);
              dA = this.rect.debugDiv('a');
              dB = tag.rect.debugDiv('b');
            }
            intersects = {};
            intersects.left = Math.max(this.rect.left, tag.rect.left);
            intersects.top = Math.max(this.rect.top, tag.rect.top);
            intersects.right = Math.min(this.rect.left + this.rect.width, tag.rect.left + tag.rect.width);
            intersects.bottom = Math.min(this.rect.top + this.rect.height, tag.rect.top + tag.rect.height);
            hitTestCanvas = Tag.hitTestCanvas;
            hitTestCanvas.width = intersects.right - intersects.left;
            hitTestCanvas.height = intersects.bottom - intersects.top;
            if (this.debug) {
              hitTestCanvas.style.top = intersects.top + "px";
              hitTestCanvas.style.left = intersects.left + 'px';
            }
            stage = Tag.stage;
            if (hitTestCanvas.width === 0 || hitTestCanvas.height === 0) {
              if (this.debug) {
                stage.removeChild(dA);
                stage.removeChild(dB);
              }
              return true;
            }
            ctx = hitTestCanvas.getContext('2d');
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = "rgba(0, 0, 0, .8)";
            ctx.strokeStyle = "rgba(0, 0, 0, .8)";
            ctx.lineWidth = 5;
            ctx.font = "bold " + this.el.style.fontSize + " " + this.fontName;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            translateLeftThis = 0;
            translateTopThis = -2;
            translateLeftThat = tag.rect.left - intersects.left;
            if (translateLeftThat === 0) {
              translateLeftThat = 0;
              translateLeftThis = this.rect.left - intersects.left;
            }
            translateTopThat = tag.rect.top - intersects.top;
            if (translateTopThat === 0) {
              translateTopThat = 0;
              translateTopThis += this.rect.top - intersects.top;
            }
            ctx.save();
            if (this.rotation === 90) {
              ctx.rotate(90 * Math.PI / 180);
              ctx.translate(0, -this.rect.width - (0.5 + translateLeftThis) | 0);
              ctx.fillText(this.tag, 0, 0);
              ctx.strokeText(this.tag, 0, 0);
            } else {
              ctx.fillText(this.tag, (0.5 + translateLeftThis) | 0, (0.5 + translateTopThis) | 0);
              ctx.strokeText(this.tag, (0.5 + translateLeftThis) | 0, (0.5 + translateTopThis) | 0);
            }
            ctx.restore();
            ctx.font = "bold " + tag.el.style.fontSize + " '" + this.fontName + "'";
            ctx.save();
            if (tag.rotation === 90) {
              ctx.rotate(90 * Math.PI / 180);
              ctx.translate((0.5 + translateTopThat - 2) | 0, -tag.rect.width - (0.5 + translateLeftThat) | 0);
              ctx.fillText(tag.tag, 0, 0);
              ctx.strokeText(tag.tag, 0, 0);
            } else {
              ctx.fillText(tag.tag, (0.5 + translateLeftThat) | 0, (0.5 + translateTopThat - 2) | 0);
              ctx.strokeText(tag.tag, (0.5 + translateLeftThat) | 0, (0.5 + translateTopThat - 2) | 0);
            }
            pixelData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            data = pixelData.data;
            pixels = data.length;
            isOpaque = false;
            for (i = 0; i < pixels; i += 4) {
              if (data[i + 3] > 250) {
                isOpaque = true;
                break;
              }
            }
            if (this.debug) {
              stage.removeChild(dA);
              stage.removeChild(dB);
            }
            if (!isOpaque) return false;
            return true;
          } else {
            return false;
          }
        }
      };

      return Tag;

    })();
  });
