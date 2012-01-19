require.config
  baseUrl: '/javascripts'
  priority:[
   "http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"
  ]

  paths:
    Tag: "tag-cloud/Tag"
    Rect: "tag-cloud/Rect"
    TagCloud: "tag-cloud/TagCloud"

require [
  'app'
  'loading-wheel'
], (App, LoadingWheel)->
  
  $(document).ready ->
    window.app = new App
    loadingWheel = new LoadingWheel
    count = 0
    (animloop = ->
      requestAnimFrame animloop
      loadingWheel.render(count++)
    )()
  
  #require [ 'font-plus-manager' ], (FontPlusManager)->
  #  console.log arguments
  #  new FontPlusManager



window.requestAnimFrame = (->
  window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback) ->
    window.setTimeout callback, 1000 / 60
)()
