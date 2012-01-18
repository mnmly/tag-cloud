
  define(function() {
    var Evented;
    return Evented = (function() {

      function Evented() {
        this.events = {};
      }

      Evented.prototype.bind = function(e, fn) {
        var _base, _ref;
        if ((_ref = (_base = this.events)[e]) == null) _base[e] = [];
        this.events[e].push(fn);
        return this;
      };

      Evented.prototype.unbind = function(e, fn) {
        if (this.events[e] == null) return;
        return this.events[e].splice(this.events[e].indexOf(fn), 1);
      };

      Evented.prototype.trigger = function(e) {
        var i;
        if (this.events[e] == null) return;
        i = this.events[e].length - 1;
        while (i >= 0) {
          this.events[e][i].apply(this, [].slice.call(arguments, 1));
          i--;
        }
        return this;
      };

      return Evented;

    })();
  });
