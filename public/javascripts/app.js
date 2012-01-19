(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["TagCloud", "LoadingWheel", "Evented", "vendor/jquery.uniform.min"], function(TagCloud, LoadingWheel, Evented) {
    var App;
    return App = (function() {

      __extends(App, Evented);

      App.prototype.saveTagData = function() {
        var $jqXHR, tagData;
        tagData = [];
        $(".tag").each(function() {
          var rect, tag;
          if ($(this).data('tag') != null) {
            tag = $(this).data('tag');
            rect = tag.rect;
            return tagData.push({
              top: rect.top,
              left: rect.left,
              rotation: tag.rotation,
              width: rect.width,
              height: rect.height,
              fontFamily: tag.fontName,
              fontSize: tag.size * tag.fontZoom
            });
          }
        });
        $jqXHR = $.ajax("/s/" + ($("#screen-name-container .inner span").text().replace('@', '')), {
          type: 'post',
          data: {
            tags: tagData
          }
        });
        return $jqXHR.success(function(data) {
          return console.log(data);
        });
      };

      function App(tweetData) {
        if (tweetData == null) tweetData = null;
        App.__super__.constructor.apply(this, arguments);
        this.setupTypeList();
        this.attachEvents();
        this.container = $(".container");
        this.screenNameField = $("#screen-name");
        if (tweetData == null) {
          this.setupLoadingWheel();
        } else {
          this.setupPreload(tweetData);
          this.prepareTagCloud(tweetData.tweets, tweetData.screenName);
        }
      }

      App.prototype.setupPreload = function(tweetData) {
        this.container.addClass('view');
        return this.createLabel(tweetData.screenName);
      };

      App.prototype.attachEvents = function() {
        var _this = this;
        this.container = $(".container");
        this.screenNameField = $("#screen-name");
        $("a[href*=like], #like").hover(function() {
          return $("#like").addClass('hover');
        }, function() {
          return $("#like").removeClass('hover');
        });
        $("a[href*=what], #what").hover(function() {
          return $("#what").addClass('hover');
        }, function() {
          return $("#what").removeClass('hover');
        });
        $("#view-mode").click(function(e) {
          var $el;
          e.preventDefault();
          $el = $("#view-mode");
          $el.toggleClass('normal-view');
          if (!$el.hasClass('normal-view')) {
            $("#stage .tag").each(function() {
              var style;
              style = $(this).attr('style').replace('rotate(60deg) skew(0deg, -30deg) scale(1, 1.16)', '');
              return $(this).css('-webkit-transform', style);
            });
          } else {
            $("#stage .tag").each(function() {
              var style;
              style = $(this).attr('style').replace('translate3d', 'rotate(60deg) skew(0deg, -30deg) scale(1, 1.16) translate3d');
              return $(this).css('-webkit-transform', style);
            });
          }
          return $("#stage").toggleClass('normal-view');
        });
        this.screenNameField.focus(function() {
          return _this.screenNameField.parent().addClass('state-focus');
        });
        this.screenNameField.blur(function() {
          if (_this.screenNameField.val() === '') {
            _this.screenNameField.parent().removeClass('state-focus');
            _this.screenNameField.parent().removeClass('state-valid');
            return _this.container.removeClass('ready');
          }
        });
        this.screenNameField.keyup(function() {
          if (_this.screenNameField.val().length > 0) {
            _this.screenNameField.parent().removeClass('state-focus');
            _this.screenNameField.parent().addClass('state-valid');
            return _this.container.addClass('ready');
          }
        });
        $("#twitter-form").submit(function(e) {
          e.preventDefault();
          if (_this.screenNameField.val().replace('@', '').length === 0) {
            retuen(false);
          }
          _this.container.removeClass('ready');
          _this.container.addClass('fetching');
          return _this.startFetching();
        });
        return this.bind('onFontReady', function(fontName) {
          _this.isFontLoaded = false;
          return setTimeout(function() {
            return _this.kickoffTagCloud(fontName);
          }, 1000);
        });
      };

      App.prototype.startFetching = function() {
        var $jqXHR, screenName;
        var _this = this;
        screenName = this.screenNameField.val().replace('@', '');
        $jqXHR = $.ajax({
          url: "/f?n=" + screenName
        });
        $jqXHR.success(function(data) {
          if (data.statusCode != null) {
            return _this.startFetching();
          } else {
            _this.container.addClass('view');
            _this.container.removeClass('fetching');
            _this.createLabel();
            return setTimeout(function() {
              _this.screenNameField.parents('form').remove();
              _this.loadingWheel.doneLoading = true;
              return _this.prepareTagCloud(data, screenName);
            }, 500);
          }
        });
        return $jqXHR.error(function(data) {
          return console.log(arguments);
        });
      };

      App.prototype.createLabel = function(screenName) {
        var $inner, $nameContainer;
        if (screenName == null) screenName = null;
        if (screenName == null) {
          screenName = this.screenNameField.val().replace('@', '');
        }
        $nameContainer = $("<div id='screen-name-container'/>");
        $inner = $("<span class='inner'></span>");
        $inner.append($("#icon-twitter"));
        $inner.append("<a href=\"/" + screenName + "\" target='_blank'>@" + screenName + "</a>");
        $nameContainer.append($inner);
        return this.container.prepend($nameContainer);
      };

      App.prototype.kickoffTagCloud = function(fontName) {
        if (fontName == null) fontName = "AXIS Std";
        this.tagCloud = new TagCloud(this.data, 4, 500, 500, fontName);
        return this.tagCloud.bind("onLoopEnd", this.onLoopEndCallBack);
      };

      App.prototype.prepareTagCloud = function(data, screenName) {
        var _this = this;
        this.data = data.splice(0, 100);
        this.screenName = screenName;
        this.trigger('onFetchDone', this.data);
        this.onLoopEndCallBack = function() {
          var _this = this;
          return setTimeout(function() {
            $("#stage").addClass('normal-view');
            $("#stage .tag").each(function() {
              var style;
              style = $(this).attr('style').replace('rotate(60deg) skew(0deg, -30deg) scale(1, 1.16)', '');
              return $(this).css('-webkit-transform', style);
            });
            $("#view-mode").addClass('ready').addClass('normal-view');
            return $("#view-mode .arrow").delay(1000).fadeOut(1000, function() {
              return $(this).remove();
            });
          }, 500);
        };
        history.pushState({}, "TweetCloud | @" + screenName, "" + (screenName.toLowerCase()));
        this.isFontLoaded = false;
        return setInterval(function() {
          if (_this.isFontLoaded) return _this.kickoffTagCloud();
        }, 5000);
      };

      App.prototype.setupLoadingWheel = function() {
        this.loadingWheel = new LoadingWheel();
        return this.loadingWheel.doneLoading = false;
      };

      App.prototype.setupTypeList = function() {
        var dom, fontName, list, options, val, weight, _i, _len, _ref;
        list = {
          "ロダン": {
            family: "RodinPro",
            weight: ["L", "M", "DB", "B", "EB", "UB"]
          },
          "ロダン墨東 Pro": {
            family: "RodinBokutohPro",
            weight: ["L", "M", "DB", "B", "EB", "UB"]
          },
          "筑紫明朝 P": {
            family: "TsukuMinPro",
            weight: ["L", "LB", "R", "RB", "M", "D", "B", "E", "H"]
          },
          "イワタ正楷書体": {
            family: "PSeKIWA",
            weight: ['Md']
          },
          "モトヤ行書3": {
            family: "MotoyaGyosyoStd",
            weight: ["W3"]
          },
          "筑紫A丸ゴシック": {
            family: "TsukuBRdGothicStd",
            weight: ["L", "R", "M", "D", "E"]
          }
        };
        dom = "";
        for (fontName in list) {
          val = list[fontName];
          options = "";
          _ref = val.weight;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            weight = _ref[_i];
            options += "<option data-family=\"" + val.family + "\" label=\"" + weight + "\">" + fontName + ": " + weight + "</option>";
          }
          dom += "<optgroup label=" + fontName + ">" + options + "</optgroup>";
        }
        $("#font-list").append(dom);
        $("#font-list").uniform();
        return $("#font-list").change(function(e) {
          var $selected;
          $selected = $("#font-list").find(":selected");
          return $(".selectBox-label").text($selected.attr('label') + " " + $selected.val());
        });
      };

      return App;

    })();
  });

}).call(this);
