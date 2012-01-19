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
  
  #require [ 'font-plus-manager' ], (FontPlusManager)->
  #  console.log arguments
  #  new FontPlusManager



window.requestAnimFrame = (->
  window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback) ->
    window.setTimeout callback, 1000 / 60
)()
