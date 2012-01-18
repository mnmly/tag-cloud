
  define(['Tag', 'Rect'], function(Tag, Rect) {
    var TagCloud;
    return TagCloud = (function() {
      var ECCENTRICITY, LAYOUT_HORIZONTAL, LAYOUT_MIX, LAYOUT_MOST_HORIZONTAL, LAYOUT_MOST_VERTICAL, LAYOUT_VERTICAL, LOWER_START, RADIUS, STEP_SIZE, UPPER_START, archimedeanSpiral, rectangularSpiral, _archimedeanSpiral, _rectangularSpiral;

      LAYOUT_HORIZONTAL = 0;

      LAYOUT_VERTICAL = 1;

      LAYOUT_MOST_HORIZONTAL = 2;

      LAYOUT_MOST_VERTICAL = 3;

      LAYOUT_MIX = 4;

      ECCENTRICITY = 1.8;

      RADIUS = 1;

      RADIUS = 5;

      LOWER_START = 0.45;

      UPPER_START = 0.55;

      STEP_SIZE = 4;

      _rectangularSpiral = function(reverse) {
        var DEFAULT_STEP, direction, directions, dx, dy, exposed, spl;
        DEFAULT_STEP = 3;
        directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        if (reverse) directions.reverse();
        direction = directions[0];
        spl = 1;
        dx = dy = 0;
        return exposed = {
          next: function() {
            var obj, step, _ref;
            for (step = 0, _ref = spl * 2; 0 <= _ref ? step < _ref : step > _ref; 0 <= _ref ? step++ : step--) {
              if (step === spl) direction = directions[(spl - 1) % 4];
              dx += direction[0] * STEP_SIZE * DEFAULT_STEP;
              dy += direction[1] * STEP_SIZE * DEFAULT_STEP;
              obj = {
                dx: dx,
                dy: dy
              };
              return obj;
            }
            return spl += 1;
          }
        };
      };

      _archimedeanSpiral = function(reverse) {
        var DEFAULT_STEP, exposed, t;
        DEFAULT_STEP = 0.05;
        t = 0;
        return exposed = {
          next: function() {
            var obj;
            t += DEFAULT_STEP * STEP_SIZE * reverse;
            obj = {
              dx: ECCENTRICITY * RADIUS * t * Math.cos(t),
              dy: RADIUS * t * Math.sin(t)
            };
            return obj;
          }
        };
      };

      rectangularSpiral = function(reverse) {
        return _rectangularSpiral(reverse);
      };

      archimedeanSpiral = function(reverse) {
        return _archimedeanSpiral(reverse);
      };

      STEP_SIZE = 2;

      function TagCloud(tagList, layout) {
        var canvas;
        canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.setAttribute('id', 'hit-test');
        document.getElementById('stage').appendChild(canvas);
        this.drawCloud(tagList, layout);
      }

      TagCloud.prototype.drawCloud = function(tagList, layout) {
        var i, iterationFn, onLoopEnd, rectangular, sizeRect, spiral, tagStore;
        var _this = this;
        tagList.sort(function(a, b) {
          return a.tag.length - b.tag.length;
        });
        tagList.sort(function(a, b) {
          return a.size - b.size;
        });
        sizeRect = new Rect(0, 0, 500, 300);
        tagList = tagList.reverse();
        tagStore = [];
        rectangular = false;
        if (rectangular) {
          spiral = rectangularSpiral;
        } else {
          spiral = archimedeanSpiral;
        }
        i = 0;
        onLoopEnd = function() {
          return isLoopDone;
        };
        iterationFn = function(loopEntity) {
          var currentTag, flip, rot, tag, x, y;
          tag = tagList[i++];
          rot = 0;
          flip = false;
          if (layout === LAYOUT_MIX && _this.randInt(0, 2) === 0) {
            rot = 90;
          } else if (layout === LAYOUT_VERTICAL) {
            rot = 90;
          } else if (layout === LAYOUT_MOST_VERTICAL) {
            rot = 90;
            flip = true;
          } else if (layout === LAYOUT_MOST_HORIZONTAL) {
            flip = true;
          }
          currentTag = new Tag(tag.tag, tag.size, rot);
          x = sizeRect.width - currentTag.rect.width;
          if (x < 0) x = 0;
          x = _this.randInt(x * LOWER_START, x * UPPER_START);
          currentTag.rect.left = x;
          y = sizeRect.height - currentTag.rect.height;
          if (y < 0) y = 0;
          y = _this.randInt(y * LOWER_START, y * UPPER_START);
          currentTag.rect.top = y;
          _this.searchPlace(currentTag, tagStore, sizeRect, spiral, flip);
          tagStore.push(currentTag);
          return setTimeout(function() {
            var left, stage, top, _ref;
            stage = document.getElementById('stage');
            _ref = currentTag.update(), top = _ref.top, left = _ref.left;
            stage.style.marginTop = (-top + 10) + "px";
            return loopEntity.next();
          }, 100);
        };
        return this.asyncLoop(tagList.length, iterationFn, onLoopEnd);
      };

      TagCloud.prototype.doCollide = function(tag, tagStore) {
        var t, _i, _len;
        if ((this.lastCollisionHit != null) && tag.collideWith(this.lastCollisionHit, true)) {
          return true;
        }
        for (_i = 0, _len = tagStore.length; _i < _len; _i++) {
          t = tagStore[_i];
          if (tag.collideWith(t, true)) {
            this.lastCollisionHit = t;
            return true;
          }
        }
        return false;
      };

      TagCloud.prototype.searchPlace = function(currentTag, tagStore, sizeRect, spiral, flip) {
        var boundingRect, dx, dy, rectH, rectW, reverse, spiralFn, startX, startY, suboptimal, _ref;
        reverse = (0.5 + Math.random()) | 0 === 1 ? 1 : -1;
        startX = currentTag.rect.left;
        startY = currentTag.rect.top;
        boundingRect = this.getGroupBounding(tagStore, sizeRect).inflate(2, 2);
        suboptimal = null;
        rectW = sizeRect.width;
        rectH = sizeRect.height;
        spiralFn = spiral(reverse);
        while (true) {
          _ref = spiralFn.next(), dx = _ref.dx, dy = _ref.dy;
          if (Math.min(dx, dy) > Math.pow(rectW * rectW + rectH * rectH, 0.5)) {
            break;
          }
          currentTag.rect.left = startX + dx;
          currentTag.rect.top = startY + dy;
          if (!this.doCollide(currentTag, tagStore) && sizeRect.contains(currentTag.rect)) {
            if (boundingRect.collideRect(currentTag.rect)) return;
            suboptimal = currentTag.rect.copy();
          }
        }
        if (suboptimal) {
          return currentTag.rect = suboptimal;
        } else if (flip) {
          currentTag.flip();
          return this.searchPlace(currentTag, tagStore, sizeRect, spiral, false);
        }
      };

      TagCloud.prototype.getGroupBounding = function(tagStore, sizeRect) {
        var rects, tag, union;
        if (tagStore.length > 0) {
          rects = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = tagStore.length; _i < _len; _i++) {
              tag = tagStore[_i];
              _results.push(tag.rect);
            }
            return _results;
          })();
          union = rects[0].unionAll(rects.slice(1, rects.length));
          if (sizeRect.contains(union)) return union;
        }
        return sizeRect;
      };

      TagCloud.prototype.randInt = function(min, max) {
        return 0.5 + (Math.random() * (max - min) + min) | 0;
      };

      TagCloud.prototype.asyncLoop = function(iterations, func, callback) {
        var done, index, loopEntity;
        index = 0;
        done = false;
        loopEntity = {
          next: function() {
            if (done) return;
            if (index < iterations) {
              index++;
              return func(loopEntity);
            } else {
              done = true;
              return callback();
            }
          },
          iteration: function() {
            return index - 1;
          },
          "break": function() {
            done = true;
            return callback();
          }
        };
        loopEntity.next();
        return loopEntity;
      };

      return TagCloud;

    })();
  });
