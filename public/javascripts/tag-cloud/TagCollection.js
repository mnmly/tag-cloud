(function() {
  var TagCollection;

  TagCollection = (function() {

    function TagCollection() {}

    TagCollection.defaultScale = function(count, minCount, maxCount, minSize, maxSize) {
      return parseInt(minSize + Math.pow((maxSize - minSize) * (count * 1.0 / (maxCount - minCount)), 0.75), 10);
    };

    TagCollection.makeTags = function(wordcounts, minSize, maxSize, colors, scaleF) {
      var count, counts, k, maxCount, minCount, tag, tagItem, tags, v, _i, _j, _len, _len2;
      if (minSize == null) minSize = 3;
      if (maxSize == null) maxSize = 36;
      if (colors == null) colors = null;
      if (scaleF == null) scaleF = TagCollection.defaultScale;
      counts = [];
      for (_i = 0, _len = wordcounts.length; _i < _len; _i++) {
        tagItem = wordcounts[_i];
        for (k in tagItem) {
          v = tagItem[k];
          counts.push(v);
        }
      }
      maxCount = Math.max.apply(Math, counts);
      minCount = Math.min.apply(Math, counts);
      tags = [];
      for (_j = 0, _len2 = wordcounts.length; _j < _len2; _j++) {
        tagItem = wordcounts[_j];
        /* Color needs to be determined
        if colors?
          color = choice(colors)
        else
          color =
        */
        for (tag in tagItem) {
          count = tagItem[tag];
          tags.push({
            'size': scaleF(count, minCount, maxCount, minSize, maxSize),
            'tag': tag
          });
        }
      }
      console.log(tag);
      return tags;
    };

    TagCollection.drawCloud = function(tagList, surface, layout, fontName, palette, fontZoom, rectangular) {
      var key, keys;
      if (layout == null) layout = LAYOUT_MIX;
      if (fontName == null) fontName = DEFAULT_FONT;
      if (palette == null) palette = DEFAULT_PALETTE;
      if (fontZoom == null) fontZoom = 5;
      if (rectangular == null) rectangular = false;
      keys = [];
      tagList.sort(function(a, b) {
        return a.tag.length - b.tag.length;
      });
      tagList.sort(key = lambda({
        tag: len(tag['tag'])
      }));
      tagList.sort(key = lambda({
        tag: tag['size']
      }));
      return tagList.reverse();
    };

    return TagCollection;

  })();

  module.exports = TagCollection;

}).call(this);
