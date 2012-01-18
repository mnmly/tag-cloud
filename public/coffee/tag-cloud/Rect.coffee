define ->
  class Rect
    constructor: (@left = 0, @top = 0, @width, @height)->
      
    getCenter: ->
      [ @left + @width / 2, @top + @height / 2 ]
    
    ## rotates only 90deg for this sake.
    rotate: ->
      rightTop = [ @left + @width, @top ]
      tempHeight = @height
      @height = @width
      @width = tempHeight
      @

    contains: (rect)->
      isInsideHorizontal = @left < rect.left and @left + @width > rect.left + rect.width
      isInsideVertical = @top > rect.top and @top + @height > rect.top + rect.height
      isInsideVertical and isInsideHorizontal

    unionAll: (rects)->
      left = @left
      top = @top
      right = @width + @left
      bottom = @height + @top
      for rect in rects
        left = Math.min(rect.left, left)
        top = Math.min(rect.top, top)
        right = Math.max(rect.left + rect.width, right)
        bottom = Math.max(rect.top + rect.height, bottom)
      
      new Rect(left, top, right - left, bottom - top)

    collideRect: (rect, getJoin = false)->
      #not (@left > rect.right or @right < rect.left or @top > rect.bottom or @bottom < rect.top)
      not (@left > ( rect.width + rect.left ) or ( @width + @left ) < rect.left or @top > (rect.top + rect.height) or ( @top + @height ) < rect.top)

    inflate: (offsetWidth, offsetHeight)->
      new Rect( @left - offsetWidth / 2, @top - offsetHeight / 2, @width + offsetWidth, @height + offsetHeight)

    copy: ->
      new Rect(@left, @top, @width, @height)

    debugDiv: (id)->
      d = document.createElement('div')
      d.setAttribute('id', id)
      d.className = "debug"
      d.style.top = @top + "px"
      d.style.left = @left + "px"
      d.style.width = @width + "px"
      d.style.height = @height + "px"
      document.getElementById('stage').appendChild d
      d
