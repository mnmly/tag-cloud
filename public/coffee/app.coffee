define [ "TagCloud", "vendor/jquery.uniform.min" ], (TagCloud)->

  class App
    
    saveTagData: ->
      tagData = []
      $(".tag").each ->
        if $(this).data('tag')?
          tag = $(this).data('tag')
          rect = tag.rect
          tagData.push
            top: rect.top
            left: rect.left
            rotation: tag.rotation
            width: rect.width
            height: rect.height
            fontFamily: tag.fontName
            fontSize: tag.size * tag.fontZoom

      $jqXHR = $.ajax "/save/#{ $("#screen-name-container .inner span").text().replace('@', '') }",
        type: 'post'
        data:
          tags: tagData

      $jqXHR.success (data)->
        console.log data


    constructor: ->
      @setupTypeList()
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
      
      
      startFetching = ->
        $jqXHR = $.ajax url: "/fetch?n=#{$screenNameField.val().replace('@','')}"
        $jqXHR.success (data)->
          if data.statusCode?
            startFetching()
          else
            $container.addClass 'view'
            $container.removeClass 'fetching'
            $nameContainer = $("<div id='screen-name-container'/>")
            $inner = $("<span class='inner'></span>")
            $inner.append $("#icon-twitter")
            $inner.append "<span>@#{$screenNameField.val().replace('@','')}</span>"
            $nameContainer.append $inner
            $container.prepend $nameContainer
            setTimeout =>
              $screenNameField.parents('form').remove()
            , 500
            tagCloud = new TagCloud data.splice(0, 200), 4, 500, 300
        
        $jqXHR.error (data)->
          console.log arguments
          
        
      $("#twitter-form").submit (e)->
        e.preventDefault()

        $container.removeClass 'ready'
        $container.addClass 'fetching'
        startFetching()

    setupTypeList: ->
      list = {
        
        "ロダン":
          family: "RodinPro"
          weight: [ "L", "M", "DB", "B", "EB", "UB" ]

        "ロダン墨東 Pro":
          family: "RodinBokutohPro"
          weight: [ "L", "M", "DB", "B", "EB", "UB" ]
        
        "筑紫明朝 P":
          family: "TsukuMinPro"
          weight: [ "L", "LB", "R", "RB", "M", "D", "B", "E", "H" ]

        "イワタ正楷書体":
          family: "PSeKIWA"
          weight: ['Md']

        "モトヤ行書3":
          family: "MotoyaGyosyoStd"
          weight: ["W3"]

        "筑紫A丸ゴシック":
          family: "TsukuBRdGothicStd"
          weight: ["L", "R", "M", "D", "E"]
      }

      dom = ""
      for fontName, val of list
        options = ""
        for weight in val.weight
          options += "<option data-family=\"#{val.family}\" label=\"#{weight}\">#{fontName}: #{weight}</option>"
        dom += "<optgroup label=#{fontName}>#{options}</optgroup>"
        
      $("#font-list").append dom
      $("#font-list").uniform()
      $("#font-list").change (e)->
        $selected = $("#font-list").find(":selected")
        $(".selectBox-label").text $selected.attr('label') + " " + $selected.val()
        
