
  define(["TagCloud"], function(TagCloud) {
    var App;
    return App = (function() {

      function App() {
        var $container, $screenNameField;
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
        $("#twitter-form").submit(function(e) {
          console.log(e);
          e.preventDefault();
          $container.removeClass('ready');
          $container.addClass('fetching');
          return $.getJSON("/fetch?n=" + ($screenNameField.val().replace('@', '')), function(data) {
            var tagCloud;
            var _this = this;
            $container.removeClass('fetching');
            $container.addClass('view');
            $("#icon-twitter").wrapAll("<div id='screen-name-container'/>");
            $("#screen-name-container").append("<span>@" + ($screenNameField.val().replace('@', '')) + "</span>");
            setTimeout(function() {
              return $screenNameField.parents('form').remove();
            }, 500);
            return tagCloud = new TagCloud(data, 4);
          });
        });
      }

      return App;

    })();
  });
