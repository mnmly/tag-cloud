require.config
  baseUrl: '/javascripts'
  priority:[
   "http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"
  ]

  paths:
    Tag: "tag-cloud/Tag"
    Rect: "tag-cloud/Rect"
    TagCloud: "tag-cloud/TagCloud"
    Evented: "tag-cloud/Evented"
    LoadingWheel: "loading-wheel"

require [
  'app'
], (App)->
  
  $(document).ready ->
    window.app = app = new App(window.tweetData)
    count = 0
    (animloop = ->
      if (not app.loadingWheel?) or app.loadingWheel.doneLoading
        return
      requestAnimFrame animloop
      app.loadingWheel.render(count++)
    )()
    
    loadInitialFont = (data) ->
      text = (t.tag for t in data)
      _initial = fontPlusUtils.getFontForText('RodinPro-DB', text.join(''))
      window.fontPlusUtils.bind 'fontactive', (_uid, fontFamily, fontDescription, text)->
        if _initial is _uid
          app.trigger( 'onFontReady', fontFamily )
      
    app.bind 'onFetchDone', (data)->
      while ( not window.fontPlusUtils? )
        1 + 1
      loadInitialFont(data)

    require [
       'fontplus.utils'
       "https://ajax.googleapis.com/ajax/libs/webfont/1.0.24/webfont.js"
       'http://webfont.fontplus.jp/accessor/script/fontplus.js?LyzUQoPX3yA%3D'], (FontPlusUtils)->
        window.fontPlusUtils  = new FontPlusUtils(WebFont)
      

window.requestAnimFrame = (->
  window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback) ->
    window.setTimeout callback, 1000 / 60
)()
