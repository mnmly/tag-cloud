define ['Tag', 'Rect'], (Tag, Rect)->

  class TagCloud
    # LAYOUTS
    LAYOUT_HORIZONTAL = 0
    LAYOUT_VERTICAL = 1
    LAYOUT_MOST_HORIZONTAL = 2
    LAYOUT_MOST_VERTICAL = 3
    LAYOUT_MIX = 4

    ECCENTRICITY = 1.8
    RADIUS = 1
    RADIUS = 7
    LOWER_START = 0.45
    UPPER_START = 0.55
    STEP_SIZE = 4 #relative to base step size of each spiral function
    #STEP_SIZE = 19 #relative to base step size of each spiral function

    _rectangularSpiral = (reverse)->
      DEFAULT_STEP = 3 #px
      directions = [[1, 0], [ 0, 1 ], [ -1, 0 ], [ 0, -1 ]]
      if reverse
        directions.reverse()
      direction = directions[0]

      spl = 1
      dx = dy = 0

      exposed =
        next: ->
          for step in [ 0...spl * 2 ]
            if step is spl
              direction = directions[(spl - 1) % 4]
            dx += direction[0] * STEP_SIZE * DEFAULT_STEP
            dy += direction[1] * STEP_SIZE * DEFAULT_STEP
            obj =
              dx: dx
              dy: dy
            return obj
          spl += 1


    _archimedeanSpiral = (reverse)->
      DEFAULT_STEP = 0.05 #radians
      t = 0
      exposed =
        next: ->
          t += DEFAULT_STEP * STEP_SIZE * reverse
          obj =
            dx: ECCENTRICITY * RADIUS * t * Math.cos(t)
            dy: RADIUS * t * Math.sin(t)
          return obj

    rectangularSpiral = (reverse)-> _rectangularSpiral(reverse)
    archimedeanSpiral = (reverse)-> _archimedeanSpiral(reverse)


    STEP_SIZE = 2 #relative to base step size of each spiral function

    constructor: (tagList, layout, width = 500, height = 300)->
      canvas = document.createElement('canvas')
      canvas.style.position = 'absolute'
      canvas.setAttribute('id', 'hit-test')
      document.getElementById('stage').appendChild canvas
      #console.log tagList
      @drawCloud(tagList, layout, width, height)

    drawCloud: (tagList, layout, width, height)->
      # Sort by tag length
      tagList.sort (a, b)->
        a.tag.length - b.tag.length
      
      # Sort by Size
      tagList.sort (a, b)->
        a.size - b.size

      sizeRect = new Rect(0, 0, width, height)
      tagList = tagList.reverse()
      tagStore = []
      rectangular = no
      if rectangular
        spiral = rectangularSpiral
      else
        spiral = archimedeanSpiral

      i = 0
      isLoopDone = no
      onLoopEnd = -> isLoopDone = yes

      iterationFn = (loopEntity)=>
        tag = tagList[i++]
        rot = 0
        flip = no
        if layout is LAYOUT_MIX and @randInt(0, 2) is 0
          rot = 90
        else if layout is LAYOUT_VERTICAL
          rot = 90
        else if layout is LAYOUT_MOST_VERTICAL
          rot = 90
          flip = yes
        else if layout is LAYOUT_MOST_HORIZONTAL
          flip = yes
        
        currentTag = new Tag(tag.tag, tag.size, rot)

        x = sizeRect.width - currentTag.rect.width
        if x < 0 then x = 0
        x = @randInt(x * LOWER_START, x * UPPER_START)
        currentTag.rect.left = x

        y = sizeRect.height - currentTag.rect.height
        if y < 0 then y = 0
        y = @randInt(y * LOWER_START, y * UPPER_START)
        currentTag.rect.top = y

        @searchPlace(currentTag, tagStore, sizeRect, spiral, flip)
        tagStore.push(currentTag)
        # Throttling
        setTimeout ->
          stage = document.getElementById('stage')
          {top, left} = currentTag.update()
          stage.style.marginTop = ( -top + 10 ) + "px"
          loopEntity.next()
        , 100

      @asyncLoop tagList.length, iterationFn, onLoopEnd

      #while not isLoopDone
      #1 + 1
      #return tagStore

    doCollide: ( tag, tagStore )->
      if @lastCollisionHit? and tag.collideWith(@lastCollisionHit, true)
        return yes
      
      for t in tagStore
        if tag.collideWith(t, true)
          @lastCollisionHit = t
          return yes
      return no
        
    searchPlace: (currentTag, tagStore, sizeRect, spiral, flip)->
      #reverse = Math.random()
      reverse = if (0.5 + Math.random()) | 0 is 1 then 1 else -1
      startX = currentTag.rect.left
      startY = currentTag.rect.top

      boundingRect = @getGroupBounding(tagStore, sizeRect).inflate(2, 2)
      suboptimal = null
      rectW = sizeRect.width
      rectH = sizeRect.height
      spiralFn = spiral(reverse)
      while true
        {dx, dy} = spiralFn.next()
        if Math.min(dx, dy) > Math.pow( (rectW * rectW + rectH * rectH), 0.5 )
          break
        currentTag.rect.left = startX + dx
        currentTag.rect.top = startY + dy

        if not @doCollide(currentTag, tagStore) and sizeRect.contains(currentTag.rect)
          #console.log currentTag.rect.left, currentTag.rect.top
          if boundingRect.collideRect(currentTag.rect)
            #debugger
            #console.log "nice"
            #currentTag.flip()
            return
          suboptimal = currentTag.rect.copy()

      if suboptimal
        currentTag.rect = suboptimal
      else if flip
        currentTag.flip()
        @searchPlace(currentTag, tagStore, sizeRect, spiral, false)
    
    getGroupBounding: (tagStore, sizeRect)->
      #if not isinstance(sizeRect, pygame.Rect)
      #  sizeRect = Rect(0, 0, sizeRect[0], sizeRect[1])
      if tagStore.length > 0
        rects = ( tag.rect for tag in tagStore )
        union = rects[0].unionAll(rects.slice(1, rects.length))
        if sizeRect.contains(union)
          return union
      return sizeRect

    randInt: (min, max)->
      0.5 + ( Math.random() * ( max - min ) + min ) | 0

    asyncLoop: (iterations, func, callback)->
      index = 0
      done = false
      loopEntity =
        next: ->
          return  if done
          if index < iterations
            index++
            func loopEntity
          else
            done = true
            callback()
        
        iteration: ->
          index - 1
        
        break: ->
          done = true
          callback()
      
      loopEntity.next()
      loopEntity
