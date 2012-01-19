
  define(["TagCloud", "vendor/jquery.uniform.min"], function(TagCloud) {
    var App;
    return App = (function() {

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
        $jqXHR = $.ajax("/save/" + ($("#screen-name-container .inner span").text().replace('@', '')), {
          type: 'post',
          data: {
            tags: tagData
          }
        });
        return $jqXHR.success(function(data) {
          return console.log(data);
        });
      };

      function App() {
        var $container, $screenNameField, startFetching;
        this.setupTypeList();
        $container = $(".container");
        $screenNameField = $("#screen-name");
        $screenNameField.focus(function() {
          return $screenNameField.parent().addClass('state-focus');
        });
        $screenNameField.blur(function() {
          if ($screenNameField.val() === '') {
            $screenNameField.parent().removeClass('state-focus');
            $screenNameField.parent().removeClass('state-valid');
            return $container.removeClass('ready');
          }
        });
        $screenNameField.keyup(function() {
          if ($screenNameField.val().length > 0) {
            $screenNameField.parent().removeClass('state-focus');
            $screenNameField.parent().addClass('state-valid');
            return $container.addClass('ready');
          }
        });
        startFetching = function() {
          var $jqXHR;
          $jqXHR = $.ajax({
            url: "/fetch?n=" + ($screenNameField.val().replace('@', ''))
          });
          $jqXHR.success(function(data) {
            var $inner, $nameContainer, tagCloud;
            var _this = this;
            if (data.statusCode != null) {
              return startFetching();
            } else {
              $container.addClass('view');
              $container.removeClass('fetching');
              $nameContainer = $("<div id='screen-name-container'/>");
              $inner = $("<span class='inner'></span>");
              $inner.append($("#icon-twitter"));
              $inner.append("<span>@" + ($screenNameField.val().replace('@', '')) + "</span>");
              $nameContainer.append($inner);
              $container.prepend($nameContainer);
              setTimeout(function() {
                return $screenNameField.parents('form').remove();
              }, 500);
              return tagCloud = new TagCloud(data.splice(0, 200), 4, 500, 300);
            }
          });
          return $jqXHR.error(function(data) {
            return console.log(arguments);
          });
        };
        $("#twitter-form").submit(function(e) {
          e.preventDefault();
          $container.removeClass('ready');
          $container.addClass('fetching');
          return startFetching();
        });
      }

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
