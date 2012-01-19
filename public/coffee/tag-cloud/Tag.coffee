define ['Rect'], (Rect)->
  class Tag
    count = 0
    leftMost = 0
    topMost = 0

    @makeTagFromJSON = (tag, size, tagData)->
      t = new Tag(tag, size, tagData.rotation, tagData.fontFamily)
      t.fontSize = tagData.fontSize

      t.rect = new Rect()
      t.rect.width = tagData.width
      t.rect.height = tagData.height
      t.rect.top = tagData.top
      t.rect.left = tagData.left
      
    constructor: (@tag, @size, @rotation, @fontName = "AXIS Std", @fontZoom = 2.5)->
      if count++ is 0
        Tag.stage = document.getElementById('stage')
        Tag.hitTestCanvas = document.getElementById('hit-test')
        Tag.stylesheet = document.createElement('style')
        document.head.appendChild Tag.stylesheet
      @cid = "t-#{count}"
      @el = document.createElement('span')
      @el.setAttribute('id', @cid)
      @el.innerText = @tag
      @el.className = 'tag not-yet'
      @el.style.fontSize = @size * @fontZoom + 'px'
      @el.style.fontFamily = "'#{@fontName}', Helvetica"
      Tag.stage.appendChild @el
      @rect = new Rect
      @rect.width = @el.offsetWidth + 1
      @rect.height = @size * @fontZoom

      if @rotation is 90
        @rect.rotate()
      @

    update: (opacity = 1)->
      
      rule = Tag.stylesheet.innerHTML
      
      top = ( 0.5 + @rect.top ) | 0
      left = ( 0.5 + @rect.left ) | 0
      $el = $(@el)
      $el.data('tag', @)
      stage = document.getElementById('stage')
      stageWidth = stage.offsetWidth / 2
      if left < stageWidth / 2
        randomLeft = Math.random() * stageWidth / 2 - 200
      else
        randomLeft = stageWidth / 2 + Math.random() * stageWidth / 2 + 200

      randomTop = -Math.random() * 200
      if leftMost < left
        leftMost = left
      if topMost > top
        topMost = top
        
      
      
      if @rotation is 90
        pos =
          left: left + @rect.width
          top: top
      else
        pos =
          left: left
          top: top
      #$el.attr('style', '')
    
      rule += """
        ##{@cid}.tag{
          top: -100px;
          font-size: #{@fontZoom * @size}px;
          font-size: #{@fontZoom * @size / 10}rem;
          height: #{@fontZoom * @size}px;
          width: #{@el.offsetWidth}px;
          color: black; /*#{@randomColor(1, 72, 155)};*/
          -webkit-transform: rotate(60deg) skew(0deg, -30deg) scale(1, 1.16) translate3d(#{pos.left}px, #{pos.top}px, 0px) #{if @rotation is 90 then "rotate(90deg)" else "" };
          opacity: 0;
        }
        ##{@cid}.tag.ready{
          top: 0px;
          opacity: 1;
        }
        #stage.normal-view ##{@cid}.tag{
          -webkit-transform: translate3d(#{pos.left}px, #{pos.top}px, 0px) #{if @rotation is 90 then "rotate(90deg)" else "" };
          transform: scale(1, 1.16) translate(#{pos.left}px, #{pos.top}px, 0px) #{if @rotation is 90 then "rotate(90deg)" else "" };
        }
        \n
      """
      Tag.stylesheet.innerHTML = rule
      $el.append("<span>#{@tag}</span>")
      setTimeout =>
        #Tag.stylesheet.innerHTML = rule
        @el.className = 'tag ready'
      , 500
      #@el.style.webkitTransform = "translate3d(#{pos.left}px, #{pos.top}px, 0) #{if @rotation is 90 then "rotate(90deg)" else "" }"

      top: topMost
      left: leftMost

    flip: ->
      @el.style.webkitTransform = "scale(1, -1) rotate(#{@rotation}deg)"
      
    # http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
    randomColor: (r, b, g)->
      red = ( 0.5 + Math.random() * 256 ) | 0
      green = ( 0.5 + Math.random() * 256 ) | 0
      blue = ( 0.5 + Math.random() * 256 ) | 0

      # mix the color
      red = (red + r) / 2
      green = (green + g) / 2
      blue = (blue + b) / 2

      "rgb( #{ ( 0.5 + red ) | 0 }, #{ ( 0.5 + green ) | 0 }, #{ ( 0.5 + blue ) | 0 } )"

    collideWith: (tag, doMask = false)->
      unless doMask
        @rect.collideRect(tag.rect)
      else
        if @rect.collideRect(tag.rect)
          @debug = no
          if @debug
            @update(.5)
            tag.update(.5)
            dA = @rect.debugDiv('a')
            dB = tag.rect.debugDiv('b')
          
          intersects = {}
          intersects.left = Math.max(@rect.left, tag.rect.left)
          intersects.top = Math.max(@rect.top, tag.rect.top)
          intersects.right = Math.min(@rect.left + @rect.width, tag.rect.left + tag.rect.width)
          intersects.bottom = Math.min(@rect.top + @rect.height, tag.rect.top + tag.rect.height)

          hitTestCanvas = Tag.hitTestCanvas
          hitTestCanvas.width = intersects.right - intersects.left
          hitTestCanvas.height = intersects.bottom - intersects.top
          if @debug
            hitTestCanvas.style.top = intersects.top + "px"
            hitTestCanvas.style.left = intersects.left + 'px'
          
          stage = Tag.stage

          if hitTestCanvas.width is 0 or hitTestCanvas.height is 0
            if @debug
              stage.removeChild dA
              stage.removeChild dB
            return true
          ctx = hitTestCanvas.getContext('2d')
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
          ctx.fillStyle = "rgba(0, 0, 0, .8)"
          ctx.strokeStyle = "rgba(0, 0, 0, .8)"
          ctx.lineWidth = 5
          ctx.font = "bold #{@el.style.fontSize} #{@fontName}"
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
          
          translateLeftThis = 0
          translateTopThis = -2

          translateLeftThat = tag.rect.left - intersects.left

          if translateLeftThat is 0
            translateLeftThat = 0 #@rect.left - intersects.left
            translateLeftThis = @rect.left - intersects.left

          translateTopThat = tag.rect.top - intersects.top
          if translateTopThat is 0
            translateTopThat = 0 #@rect.top - intersects.top
            translateTopThis += @rect.top - intersects.top

          ctx.save()

          if @rotation is 90
            ctx.rotate(90 * Math.PI / 180)
            ctx.translate(0, -@rect.width - ( 0.5 + translateLeftThis ) | 0)
            ctx.fillText(@tag, 0,  0)
            ctx.strokeText(@tag, 0, 0)
          else
            ctx.fillText(@tag, ( 0.5 + translateLeftThis ) | 0, ( 0.5 + translateTopThis ) | 0)
            ctx.strokeText(@tag, ( 0.5 + translateLeftThis ) | 0, ( 0.5 + translateTopThis ) | 0)
          
          ctx.restore()

          #ctx.translate(intersects.left - @rect.left, intersects.top - @rect.top)
          ctx.font = "bold #{tag.el.style.fontSize} '#{@fontName}'"

          ctx.save()
          if tag.rotation is 90
            ctx.rotate(90 * Math.PI / 180)
            #ctx.translate(0, -tag.rect.width)
            ctx.translate(( 0.5 + translateTopThat - 2 ) | 0, -tag.rect.width - ( 0.5 + translateLeftThat ) | 0)
            ctx.fillText(tag.tag, 0, 0)
            ctx.strokeText(tag.tag, 0, 0)
          else

            ctx.fillText(tag.tag, ( 0.5 + translateLeftThat ) | 0, ( 0.5 + translateTopThat - 2 ) | 0)
            ctx.strokeText(tag.tag, ( 0.5 + translateLeftThat ) | 0, ( 0.5 + translateTopThat - 2 ) | 0)

          pixelData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
          data = pixelData.data
          pixels = data.length
          isOpaque = no
          for i in [ 0...pixels ] by 4
            if data[ i + 3 ] > 250
              isOpaque = true
              break
          #if hitTestCanvas.height > 10
          #  debugger
          if @debug
            stage.removeChild dA
            stage.removeChild dB
          unless isOpaque
            return false
          return true
        else
          return false
