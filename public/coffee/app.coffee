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
      #@setupTypeList()
      @attachEvents()
      @container = $(".container")
      @screenNameField = $("#screen-name")
      unless tweetData?
        @setupLoadingWheel()
      else
        @setupLoadingWheel()
        $(".loader").insertBefore('#stage')
        $(".loader p").text "Loading Type..."
        @setupPreload(tweetData)
        @prepareTagCloud(tweetData.tweets, tweetData.screenName, yes)
        #@kickOffTagCloud(tweetData.tweets, tweetData.screenName)

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

        if $el.hasClass 'normal-view'
          $("#stage .tag").each ->
            style = $(this).attr('style').replace('rotate(60deg) skew(0deg, -30deg) scale(1, 1.16)', '')
            $(this).attr('style', style)
        else
          $("#stage .tag").each ->
            style = $(this).attr('style').replace('translate3d', 'rotate(60deg) skew(0deg, -30deg) scale(1, 1.16) translate3d')
            $(this).attr('style', style)
          
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

      @bind 'onFontReady', (fontName)=>

        @isFontLoaded = no
        setTimeout =>
          @loadingWheel.doneLoading = yes
          $(".loader").fadeOut(300)
          @kickoffTagCloud(fontName)
        , 2000
    
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
            $form = @screenNameField.parents('form')
            $form.find(".loader").find('p').text "Loading Type..."
            $form.find(".loader").insertBefore $("#stage")
            $form.remove()
            @screenNameField.parents('form').remove()
            @prepareTagCloud(data, screenName)
            #@kickOffTagCloud(data, screenName)
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

    kickoffTagCloud: (fontName = "AXIS Std")->
      @tagCloud = new TagCloud @data, 4, 500, 500, fontName
      @tagCloud.bind "onLoopEnd", @onLoopEndCallBack

    prepareTagCloud: (data, screenName, preloaded = no)->
      @data = data.splice(0, 100)
      @screenName = screenName
      unless preloaded
        @trigger('onFetchDone', @data)
      @onLoopEndCallBack = ->
        setTimeout =>
          $("#stage").addClass 'normal-view'
          $("#stage .tag").each ->
            style = $(this).attr('style').replace('rotate(60deg) skew(0deg, -30deg) scale(1, 1.16)', '')
            $(this).attr('style', style)

          $("#view-mode").addClass('ready')
                            .addClass 'normal-view'
          
          $("#view-mode .arrow").delay(1000).fadeOut 1000, ->
            $(this).remove()
        , 500

      history.pushState({}, "TweetCloud | @#{screenName}", "#{screenName.toLowerCase()}")
      @isFontLoaded = no
      # If the font is not loaded after 5 seconds go with default
      setInterval =>
        if @isFontLoaded
          @kickoffTagCloud()
      , 5000
    
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
        
