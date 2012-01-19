define [ "TagCloud", "LoadingWheel", "Evented", "vendor/jquery.uniform.min" ], (TagCloud, LoadingWheel, Evented)->

  class App extends Evented
      
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

      $jqXHR = $.ajax "/s/#{ $("#screen-name-container .inner span").text().replace('@', '') }",
        type: 'post'
        data:
          tags: tagData

      $jqXHR.success (data)->
        console.log data


    constructor: (tweetData = null)->
      super
      @setupTypeList()
      @attachEvents()
      @container = $(".container")
      @screenNameField = $("#screen-name")
      unless tweetData?
        @setupLoadingWheel()
      else
        @setupPreload(tweetData)
        @kickOffTagCloud(tweetData.tweets, tweetData.screenName)

    setupPreload: (tweetData)->
      @container.addClass 'view'
      @createLabel(tweetData.screenName)
      
    attachEvents: ->

      @container = $(".container")
      @screenNameField = $("#screen-name")

      $("a[href*=like], #like").hover ->
        $("#like").addClass 'hover'
      , ->
        $("#like").removeClass 'hover'
      
      $("a[href*=what], #what").hover ->
        $("#what").addClass 'hover'
      , ->
        $("#what").removeClass 'hover'

      $("#view-mode").click (e)=>
        e.preventDefault()
        $el = $("#view-mode")
        $el.toggleClass 'normal-view'
        $("#stage").toggleClass 'normal-view'

      @screenNameField.focus =>
        @screenNameField.parent().addClass 'state-focus'

      @screenNameField.blur =>
        if @screenNameField.val() is ''
          @screenNameField.parent().removeClass 'state-focus'
          @screenNameField.parent().removeClass 'state-valid'
          @container.removeClass 'ready'

      @screenNameField.keyup =>
        if @screenNameField.val().length > 0
          @screenNameField.parent().removeClass 'state-focus'
          @screenNameField.parent().addClass 'state-valid'
          @container.addClass 'ready'
      
      
      $("#twitter-form").submit (e)=>
        e.preventDefault()
        if @screenNameField.val().replace('@', '').length is 0
          retuen false

        @container.removeClass 'ready'
        @container.addClass 'fetching'
        @startFetching()

    startFetching: ->
      screenName = @screenNameField.val().replace('@', '')
      $jqXHR = $.ajax url: "/f?n=#{screenName}"
      
      $jqXHR.success (data)=>
        if data.statusCode?
          @startFetching()
        else
          @container.addClass 'view'
          @container.removeClass 'fetching'
          @createLabel()
          setTimeout =>
            @screenNameField.parents('form').remove()
            @loadingWheel.doneLoading = yes
            @kickOffTagCloud(data, screenName)
          , 500
      
      $jqXHR.error (data)->
        console.log arguments
      

    createLabel: (screenName = null )->
      unless screenName?
        screenName = @screenNameField.val().replace('@','')
      $nameContainer = $("<div id='screen-name-container'/>")
      $inner = $("<span class='inner'></span>")
      $inner.append $("#icon-twitter")
      $inner.append "<a href=\"/#{screenName}\" target='_blank'>@#{screenName}</a>"
      $nameContainer.append $inner
      @container.prepend $nameContainer

    kickOffTagCloud: (data, screenName)->
      data = data.splice(0, 100)
      @trigger('onFetchDone', data)
      @tagCloud = new TagCloud data, 4, 500, 500, "AXIS Std"
      history.pushState({}, "TweetCloud | @#{screenName}", "#{screenName.toLowerCase()}")
      @tagCloud.bind 'onLoopEnd', ->
        setTimeout =>
          $("#stage").addClass 'normal-view'
          $("#view-mode").addClass('ready')
                            .addClass 'normal-view'
          
          $("#view-mode .arrow").delay(1000).fadeOut 1000, ->
            $(this).remove()

        , 500
    
    setupLoadingWheel: ->
      @loadingWheel = new LoadingWheel()
      @loadingWheel.doneLoading = no

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
        
