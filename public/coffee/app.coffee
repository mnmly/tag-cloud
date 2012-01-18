define [ "TagCloud" ], (TagCloud)->

  class App
    constructor: ->
      $container = $(".container")
      $screenNameField = $("#screen-name")

      $screenNameField.focus ->
        $screenNameField.parent().addClass 'state-focus'

      $screenNameField.blur ->
        if $screenNameField.val() is ''
          $screenNameField.parent().removeClass 'state-focus'
          $screenNameField.parent().removeClass 'state-valid'
          $container.removeClass 'ready'

      $screenNameField.keyup ->
        if $screenNameField.val().length > 0
          $screenNameField.parent().removeClass 'state-focus'
          $screenNameField.parent().addClass 'state-valid'
          $container.addClass 'ready'
      
      $("#twitter-form").submit (e)->
        console.log e
        e.preventDefault()

        $container.removeClass 'ready'
        $container.addClass 'fetching'

        $.getJSON "/fetch?n=#{$screenNameField.val().replace('@','')}", (data)->
          $container.removeClass 'fetching'
          $container.addClass 'view'
          $("#icon-twitter").wrapAll("<div id='screen-name-container'/>")
          $("#screen-name-container").append "<span>@#{$screenNameField.val().replace('@','')}</span>"
          setTimeout =>
            $screenNameField.parents('form').remove()
          , 500
          tagCloud = new TagCloud data, 4

