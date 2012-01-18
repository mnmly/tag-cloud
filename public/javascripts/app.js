
  define(["TagCloud"], function(TagCloud) {
    var App;
    return App = (function() {

      function App() {
        var $container, $screenNameField, startFetching;
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
            var tagCloud;
            var _this = this;
            if (data.statusCode != null) {
              console.log(data);
              return startFetching();
            } else {
              $container.removeClass('fetching');
              $container.addClass('view');
              $("#icon-twitter").wrapAll("<div id='screen-name-container'/>");
              $("#screen-name-container").append("<span>@" + ($screenNameField.val().replace('@', '')) + "</span>");
              setTimeout(function() {
                return $screenNameField.parents('form').remove();
              }, 500);
              return tagCloud = new TagCloud(data, 4);
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

      return App;

    })();
  });
