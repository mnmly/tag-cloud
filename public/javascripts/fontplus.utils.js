
  define([], function() {
    var FontPlusUtils;
    return FontPlusUtils = (function() {
      var _checkFontFromStyle, _getFontPlusInstance, _getUniqueId, _isArray, _uniqueId;

      _getFontPlusInstance = function() {
        var prop;
        for (prop in window) {
          if (prop.search(/FontPlus_.{32}$/) > -1) return window[prop];
        }
      };

      _isArray = function(el) {
        return el.constructor.toString().search('Array') > -1;
      };

      _checkFontFromStyle = function(that) {
        var f, fontList, fontNames, rule, rules, styleSheet, _i, _j, _k, _len, _len2, _len3, _ref, _ref2;
        fontNames = [];
        _ref = document.styleSheets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          styleSheet = _ref[_i];
          rules = styleSheet.cssRules ? styleSheet.cssRules : styleSheet.ruless;
          for (_j = 0, _len2 = rules.length; _j < _len2; _j++) {
            rule = rules[_j];
            if (!(((_ref2 = rule.style) != null ? _ref2.fontFamily : void 0) != null)) {
              continue;
            }
            fontList = rule.style.fontFamily.replace(/'/g, "").replace(/"/g, "").split(",");
            for (_k = 0, _len3 = fontList.length; _k < _len3; _k++) {
              f = fontList[_k];
              f = f.replace(/^\s+|\s+$/g, '');
              if (that.fontPlusInstance.plusf.indexOf(f) > -1) fontNames.push(f);
            }
          }
        }
        return fontNames;
      };

      _uniqueId = 0;

      _getUniqueId = function() {
        var _uid;
        return _uid = "fpu" + (_uniqueId++);
      };

      function FontPlusUtils(WebFont) {
        this.WebFont = WebFont;
        if (this.WebFont == null) return;
        this.events = {};
        this.fontPlusInstance = _getFontPlusInstance();
        this.attachLoadEvent(_getUniqueId(), _checkFontFromStyle(this), 0);
      }

      FontPlusUtils.prototype.getFontForText = function(fontNames, text) {
        var d, _fontNames, _uid;
        _uid = _getUniqueId();
        _fontNames = fontNames;
        if (_isArray(fontNames)) _fontNames = fontNames.join('", "');
        d = document.createElement('div');
        d.textContent = text;
        document.body.appendChild(d);
        d.style.fontFamily = "\"" + _fontNames + "\"";
        this.fontPlusInstance.ready();
        document.body.removeChild(d);
        this.isLoading = true;
        this.attachLoadEvent(_uid, fontNames, text);
        return _uid;
      };

      FontPlusUtils.prototype.attachLoadEvent = function(uid, fontNames, text) {
        var families;
        var _this = this;
        if (_isArray(fontNames)) {
          families = fontNames;
        } else {
          families = [fontNames];
        }
        return (function(uid) {
          return _this.WebFont.load({
            custom: {
              families: families
            },
            fontactive: function(fontFamily, fontDescription) {
              return _this.trigger('fontactive', uid, fontFamily, fontDescription);
            },
            fontinactive: function(fontFamily, fontDescription) {
              return _this.trigger('fontinactive', uid, fontFamily, fontDescription);
            },
            active: function() {
              var fontPlusCSS;
              if (text === 0) _this.trigger('initialactive');
              fontPlusCSS = document.querySelectorAll('[id=fontplus_css]');
              if (fontPlusCSS.length > 1) {
                document.head.removeChild(fontPlusCSS[0]);
              }
              console.log("active", uid);
              _this.isLoading = false;
              return _this.trigger('active', uid);
            },
            inactive: function() {
              _this.isLoading = false;
              return _this.trigger('inactive', uid);
            }
          });
        })(uid);
      };

      FontPlusUtils.prototype.bind = function(e, fn) {
        var _base, _ref;
        if ((_ref = (_base = this.events)[e]) == null) _base[e] = [];
        this.events[e].push(fn);
        return this;
      };

      FontPlusUtils.prototype.unbind = function(e, fn) {
        if (this.events[e] == null) return;
        return this.events[e].splice(this.events[e].indexOf(fn), 1);
      };

      FontPlusUtils.prototype.trigger = function(e) {
        var i;
        if (this.events[e] == null) return;
        i = this.events[e].length - 1;
        while (i >= 0) {
          this.events[e][i].apply(this, [].slice.call(arguments, 1));
          i--;
        }
        return this;
      };

      return FontPlusUtils;

    })();
  });
