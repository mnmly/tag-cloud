
  define(["vendor/jquery.easing.1.3"], function() {
    var LoadingWheel;
    return LoadingWheel = (function() {
      var ratio, shapes, size, _shapes, _toRad;

      size = 30;

      shapes = {
        circle: {
          x: [],
          y: []
        },
        triangle: {
          x: [size / 2 + Math.sqrt(3) * size / 4 + 3, size / 2 + Math.sqrt(3) * size / 2 + 3, size / 2 + 3, size / 2 + Math.sqrt(3) * size / 4 + 3],
          y: [size / 2, size / 2 + size / 4 * 3, size / 2 + size / 4 * 3, size / 2]
        },
        square: {
          x: [size / 2, size + size / 2, size + size / 2, size / 2, size / 2, size / 2],
          y: [size / 2, size / 2, size + size / 2, size + size / 2, size / 2]
        }
      };

      ratio = .5;

      _toRad = function(deg) {
        return deg / 180 * Math.PI;
      };

      _shapes = ['triangle', 'circle', 'square'];

      function LoadingWheel() {
        this.canvas = document.getElementById('loader');
        this.context = this.canvas.getContext('2d');
        this.from = _shapes[0];
        this.to = _shapes[1];
        this.createPoints();
        this.assignTarget();
        this.isTweening = false;
        this.index = 1;
        this.flag = 1;
        this.maxPoints = Math.max(this.x1.length, this.x2.length);
        this.xc = new Array(this.maxPoints);
        this.yc = new Array(this.maxPoints);
        this.attachEvents();
      }

      LoadingWheel.prototype.createPoints = function() {
        var i, rad, sx, sxs, sy, sys, tx, txs, ty, tys, x, y;
        tx = shapes.triangle.x.slice(0);
        ty = shapes.triangle.y.slice(0);
        txs = shapes.triangle.x = [];
        tys = shapes.triangle.y = [];
        sx = shapes.square.x.slice(0);
        sy = shapes.square.y.slice(0);
        sxs = shapes.square.x = [];
        sys = shapes.square.y = [];
        for (i = 0; i < 360; i += 5) {
          rad = _toRad(i - 90);
          x = size + size / 2 * Math.cos(rad);
          y = size + size / 2 * Math.sin(rad);
          shapes.circle.x.push(x);
          shapes.circle.y.push(y);
          if (i < 120) {
            txs.push(tx[0] + ((tx[1] - tx[0]) / 120) * i);
            tys.push(ty[0] + ((ty[1] - ty[0]) / 120) * i);
          } else if ((120 <= i && i < 240)) {
            txs.push(tx[1] + ((tx[2] - tx[1]) / 120) * (i - 120));
            tys.push(ty[1] + ((ty[2] - ty[1]) / 120) * (i - 120));
          } else {
            txs.push(tx[2] + ((tx[3] - tx[2]) / 120) * (i - 240));
            tys.push(ty[2] + ((ty[3] - ty[2]) / 120) * (i - 240));
          }
          if (i < 90) {
            sxs.push(sx[0] + ((sx[1] - sx[0]) / 90) * i);
            sys.push(sy[0] + ((sy[1] - sy[0]) / 90) * i);
          } else if ((90 <= i && i < 180)) {
            sxs.push(sx[1] + ((sx[2] - sx[1]) / 90) * (i - 90));
            sys.push(sy[1] + ((sy[2] - sy[1]) / 90) * (i - 90));
          } else if ((180 <= i && i < 270)) {
            sxs.push(sx[2] + ((sx[3] - sx[2]) / 90) * (i - 180));
            sys.push(sy[2] + ((sy[3] - sy[2]) / 90) * (i - 180));
          } else {
            sxs.push(sx[3] + ((sx[4] - sx[3]) / 90) * (i - 270));
            sys.push(sy[3] + ((sy[4] - sy[3]) / 90) * (i - 270));
          }
        }
      };

      LoadingWheel.prototype.render = function(t) {
        var i, _ref;
        this.context.clearRect(0, 0, size + 5, size + 5);
        this.context.strokeStyle = 'rgba(0, 0, 0, .5)';
        this.context.save();
        this.context.translate(-size / 2, -size / 2);
        this.context.beginPath();
        this.context.fillStyle = 'rgba(0, 0, 0, .5)';
        this.tweenShape(t);
        this.context.moveTo(this.xc[0], this.yc[0]);
        for (i = 0, _ref = this.xc.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          if (i < this.xc.length - 1) {
            this.context.lineTo(this.xc[i + 1], this.yc[i + 1]);
          }
        }
        this.context.lineTo(this.xc[0], this.yc[0]);
        this.context.closePath();
        this.context.fill();
        this.context.strokeStyle = 'rgba(255, 0, 0, .1)';
        this.context.beginPath();
        this.context.stroke();
        return this.context.restore();
      };

      LoadingWheel.prototype.attachEvents = function() {
        var _this = this;
        return $("#identity span").mouseenter(function(e) {
          var index;
          index = $(e.target).index('span');
          _this.to = _shapes[index];
          _this.assignTarget();
          return _this.isTweening = true;
        });
      };

      LoadingWheel.prototype.tweenShape = function(t) {
        var k, k1, k2, p, speed, _ref, _results;
        speed = 50;
        _results = [];
        for (k = 0, _ref = this.maxPoints; 0 <= _ref ? k < _ref : k > _ref; 0 <= _ref ? k++ : k--) {
          if (this.x1.length >= this.x2.length) {
            k1 = k;
            k2 = 0.5 + (k / (this.x1.length / this.x2.length)) | 0;
          } else {
            k1 = 0.5 + (k / (this.x2.length / this.x1.length)) | 0;
            k2 = k;
          }
          p = $.easing.easeInOutQuint(null, t % speed, 0, 1, speed);
          if (t % speed === 0) {
            this.index++;
            if (this.index === 3) this.index = 0;
            this.from = this.to;
            this.to = _shapes[this.index];
            this.assignTarget();
            this.isTweening = false;
            break;
          } else {
            this.xc[k] = this.x1[k1] + p * (this.x2[k2] - this.x1[k1]);
            _results.push(this.yc[k] = this.y1[k1] + p * (this.y2[k2] - this.y1[k1]));
          }
        }
        return _results;
      };

      LoadingWheel.prototype.assignTarget = function() {
        this.x1 = shapes[this.from].x;
        this.y1 = shapes[this.from].y;
        this.x2 = shapes[this.to].x;
        return this.y2 = shapes[this.to].y;
      };

      return LoadingWheel;

    })();
  });
