
  define(["fontplus.utils", "https://ajax.googleapis.com/ajax/libs/webfont/1.0.24/webfont.js", 'http://webfont.fontplus.jp/accessor/script/fontplus.js?DCe-AKxpbX0%3D'], function(FontPlusUtils) {
    var FontPlusManager;
    return FontPlusManager = (function() {

      FontPlusManager.prototype.containsJapanese = function(str) {
        return /[\u4E00-\u9FFF\u30A0-\u30ff]/.test(str);
      };

      function FontPlusManager() {
        var d, fontName, fontPlusUtils, list, uid, _i, _len, _ref;
        fontPlusUtils = new FontPlusUtils(WebFont);
        uid = 0;
        d = 0;
        list = [];
        _ref = fontPlusUtils.fontPlusInstance.plusf;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          fontName = _ref[_i];
          if (this.containsJapanese(fontName)) list.push(fontName);
        }
        fontPlusUtils.bind("initialactive", function(_uid, fontFamily, fontDescription) {});
        fontPlusUtils.bind("fontactive", function(_uid, fontFamily, fontDescription, text) {
          return console.log("fontActive binded", arguments);
        });
        fontPlusUtils.bind("active", function(_uid) {});
        window.fontPlusUtils = fontPlusUtils;
      }

      return FontPlusManager;

    })();
  });
