(function() {
  var TagCounter;

  TagCounter = (function() {

    function TagCounter(text) {
      var counted, key, obj, val, word, words, _i, _len;
      words = text.match(/\w+/g).map(function(el) {
        return el.toLowerCase();
      });
      counted = {};
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        word = words[_i];
        if (word.length > 1) {
          if (counted[word] != null) {
            counted[word] += 1;
          } else {
            counted[word] = 1;
          }
        }
      }
      this.list = [];
      for (key in counted) {
        val = counted[key];
        obj = {};
        obj[key] = val;
        this.list.push(obj);
      }
      this.list;
    }

    return TagCounter;

  })();

  module.exports = TagCounter;

}).call(this);
