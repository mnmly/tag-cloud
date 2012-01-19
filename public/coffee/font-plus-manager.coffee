define [
  "fontplus.utils"
   "https://ajax.googleapis.com/ajax/libs/webfont/1.0.24/webfont.js"
   'http://webfont.fontplus.jp/accessor/script/fontplus.js?LyzUQoPX3yA%3D'
], (FontPlusUtils)->

  class FontPlusManager
    containsJapanese: (str)->
      /[\u4E00-\u9FFF\u30A0-\u30ff]/.test(str)

    constructor: ->
      fontPlusUtils = new FontPlusUtils(WebFont)
      uid = 0
      d = 0
      list = []

      for fontName in fontPlusUtils.fontPlusInstance.plusf
        if @containsJapanese(fontName)
          list.push fontName


      fontPlusUtils.bind "initialactive", (_uid, fontFamily, fontDescription) ->
      
      fontPlusUtils.bind "fontactive", (_uid, fontFamily, fontDescription, text) ->
        console.log "fontActive binded", arguments
      
      fontPlusUtils.bind "active", (_uid) ->
      
      window.fontPlusUtils = fontPlusUtils
