#### FontPlusUtils
# FontPlusUtils provides additional api to deal 
# with FontPlus js library

# As FontPlus downloads the typefaces **with specified characters**,
# where `font-family` is set using one of the typefaces from FontPlus,
# when asynchronous rendering is required, it won't render charactors 
# which was not loaded on first request.
#
# Therefore to render the new block text using fontplus typeface, it
# requires additional request to get new characters.

# FontPlusUtils will provide following utilities
# 
# * FontLoadedEvent(requires [webfontloader](https://github.com/typekit/webfontloader))
# * fontPlusInstance maps to FontPlus instance 
define [], ->
  class FontPlusUtils

    _getFontPlusInstance = ->
      for prop of window
        if prop.search(/FontPlus_.{32}$/) > -1
          return window[ prop ]

    _isArray = (el)->
      el.constructor.toString().search('Array') > -1
    
    # Same implementation in FontPlus.js to check fontFamily from StyleSheets
    _checkFontFromStyle = (that)->
      fontNames = []
      for styleSheet in document.styleSheets
        rules = if styleSheet.cssRules then styleSheet.cssRules else styleSheet.ruless
        for rule in rules when rule.style?.fontFamily?
          fontList = rule.style.fontFamily
                      .replace(/'/g, "") # Remove single quotation marks
                      .replace(/"/g, "") # Remove double quotation marks
                      .split(",") # Make string into array

          for f in fontList
            f = f.replace(/^\s+|\s+$/g, '') # Removed unnecessary whitespace
            if that.fontPlusInstance.plusf.indexOf(f) > -1
              fontNames.push f

      return fontNames

    _uniqueId = 0
    
    _getUniqueId = ->
      _uid = "fpu" + ( _uniqueId++ )
    
    # Constructor requires `WebFont`
    constructor: (@WebFont)->
      return unless @WebFont?
      @events = {}
      @fontPlusInstance = _getFontPlusInstance()

      # Kickoff monitoring initial Load Event.
      @attachLoadEvent _getUniqueId(), _checkFontFromStyle(@), 0
    
      
    getFontForText: (fontNames, text)->
      _uid = _getUniqueId()

      _fontNames = fontNames
      # if fontNames is array, join it to comma separated string
      if _isArray(fontNames)
        _fontNames = fontNames.join('", "')
      
      # Make a dummy div with specified text
      d = document.createElement('div')
      d.textContent = text
      
      # Append the dummy div to body so that FontPlus can retrieve 
      # fontFamily from style attribute
      document.body.appendChild d
      d.style.fontFamily = "\"#{_fontNames}\""
      
      # Send request to get Font
      @fontPlusInstance.ready()
      # removed the dummy
      document.body.removeChild d
      
      # Flag as loading
      @isLoading = yes
      @attachLoadEvent(_uid, fontNames, text)
      _uid
      


    attachLoadEvent: (uid, fontNames, text)->
      if _isArray(fontNames)
        families = fontNames
      else
        families = [ fontNames ]

      do (uid)=>
        @WebFont.load
          custom:
            families: families

          fontactive: (fontFamily, fontDescription) =>
            # it will trigger the fontactive event if it succeeded to load
            @trigger('fontactive', uid, fontFamily, fontDescription)

          fontinactive: (fontFamily, fontDescription) =>
            # it will trigger the fontinactive event if it fails to load
            @trigger('fontinactive', uid, fontFamily, fontDescription)

          active: =>
            if text is 0
              # If this is the font active event from the initial load from stylesheets
              @trigger('initialactive')
            
            # Remove duplicate stylesheets
            fontPlusCSS = document.querySelectorAll('[id=fontplus_css]')
            if fontPlusCSS.length > 1
              document.head.removeChild fontPlusCSS[0]
            
            console.log "active", uid
            @isLoading = no
            @trigger('active', uid)

          inactive: =>
            @isLoading = no
            @trigger('inactive', uid)
            
    # It will provide small PubSub functionality.
    bind: (e, fn) ->
      @events[e] ?= []
      @events[e].push fn
      return @

    unbind: (e, fn) ->
      return unless @events[e]?
      @events[e].splice @events[e].indexOf(fn), 1

    trigger: (e) ->
      return unless @events[e]?
      i = @events[e].length - 1
      while i >= 0
        @events[e][i].apply this, [].slice.call(arguments, 1)
        i--
      return @
