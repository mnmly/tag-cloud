define ->
  
  #### Evented
  #
  # Make the class **eventable** (bind, trigger, unbind)
  
  class Evented

    constructor: ->
      @events = {}

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
