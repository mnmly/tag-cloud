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
   'fontplus.utils'
   "https://ajax.googleapis.com/ajax/libs/webfont/1.0.24/webfont.js"
   'http://webfont.fontplus.jp/accessor/script/fontplus.js?LyzUQoPX3yA%3D'
], (App, FontPlusUtils)->

  $(document).ready ->

    window.fontPlusUtils  = new FontPlusUtils(WebFont)
    window.app = app = new App(window.tweetData)
    count = 0
    (animloop = ->
      if (not app.loadingWheel?) or app.loadingWheel.doneLoading
        return
      requestAnimFrame animloop
      app.loadingWheel.render(count++)
    )()

    app.bind 'onFetchDone', (data)->
      text = (t.tag for t in data)
      _initial = fontPlusUtils.getFontForText('RodinPro-DB', text.join(''))
      window.fontPlusUtils.bind 'fontactive', (_uid, fontFamily, fontDescription, text)->
        if _initial is _uid
          window.app.trigger( 'onFontReady', fontFamily )

window.requestAnimFrame = (->
  window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback) ->
    window.setTimeout callback, 1000 / 60
)()
