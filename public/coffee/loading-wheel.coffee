define [ "vendor/jquery.easing.1.3" ], ->

  class LoadingWheel
    size = 30
    shapes =
      circle:
        x: []
        y: []
      triangle:
        x: [size / 2 + Math.sqrt(3) * size / 4 + 3, size / 2 + Math.sqrt(3) * size / 2 + 3, size / 2 + 3, size / 2 + Math.sqrt(3) * size / 4 + 3]
        y: [size / 2, size / 2 + size / 4 * 3, size / 2 + size / 4 * 3, size / 2]
      square:
        x: [size / 2, size + size / 2, size + size / 2, size / 2, size / 2, size / 2]
        y: [size / 2, size / 2, size + size / 2, size + size / 2, size / 2]
    
    ratio = .5

    _toRad = (deg)->
      deg / 180 * Math.PI
    _shapes = ['triangle', 'circle', 'square']

    constructor: ->
      @canvas = document.getElementById('loader')
      @context = @canvas.getContext('2d')
      @from = _shapes[0]
      @to = _shapes[1]
      @createPoints()
      @assignTarget()
      @isTweening = no
      @index = 1
      @flag = 1
      @maxPoints = Math.max(@x1.length, @x2.length)
      @xc = new Array(@maxPoints)
      @yc = new Array(@maxPoints)
      @attachEvents()
    
    createPoints: ->
      tx = shapes.triangle.x.slice(0)
      ty = shapes.triangle.y.slice(0)
      txs = shapes.triangle.x = []
      tys = shapes.triangle.y = []
      
      sx = shapes.square.x.slice(0)
      sy = shapes.square.y.slice(0)
      sxs = shapes.square.x = []
      sys = shapes.square.y = []

      for i in [0...360] by 5
        rad = _toRad(i - 90)
        x = size + size / 2 * Math.cos(rad)
        y = size + size / 2 * Math.sin(rad)
        shapes.circle.x.push x
        shapes.circle.y.push y
        if i < 120
          txs.push ( tx[0] + ( ( tx[1] - tx[0] ) / 120 ) * i )
          tys.push ( ty[0] + ( ( ty[1] - ty[0] ) / 120 ) * i )
        else if 120 <= i < 240
          txs.push tx[1] + ( ( tx[2] - tx[1] ) / 120 ) * ( i - 120 )
          tys.push ty[1] + ( ( ty[2] - ty[1] ) / 120 ) * ( i - 120 )
        else
          txs.push tx[2] + ( ( tx[3] - tx[2] ) / 120 ) * ( i - 240 )
          tys.push ty[2] + ( ( ty[3] - ty[2] ) / 120 ) * ( i - 240 )

        if i < 90
          sxs.push (sx[0] + ( ( sx[1] - sx[0] ) / 90 ) * i)
          sys.push (sy[0] + ( ( sy[1] - sy[0] ) / 90 ) * i)
          
        else if 90 <= i < 180
          sxs.push (sx[1] + ( ( sx[2] - sx[1] ) / 90 ) * ( i - 90 ))
          sys.push (sy[1] + ( ( sy[2] - sy[1] ) / 90 ) * ( i - 90 ))

        else if 180 <= i < 270
          sxs.push (sx[2] + ( ( sx[3] - sx[2] ) / 90 ) * ( i - 180 ))
          sys.push (sy[2] + ( ( sy[3] - sy[2] ) / 90 ) * ( i - 180 ))
        
        else
          sxs.push (sx[3] + ( ( sx[4] - sx[3] ) / 90 ) * ( i - 270 ))
          sys.push (sy[3] + ( ( sy[4] - sy[3] ) / 90 ) * ( i - 270 ))

      return

    render: (t)->
      @context.clearRect(0, 0, size + 5, size + 5)
      @context.strokeStyle = 'rgba(0, 0, 0, .5)'
      @context.save()
      @context.translate(-size / 2, -size / 2)
      @context.beginPath()
      @context.fillStyle = 'rgba(0, 0, 0, .5)'
      
      @tweenShape(t)

      #@context.moveTo( (0.5 + @xc[0]) | 0, (0.5 + @yc[0]) | 0)
      @context.moveTo( @xc[0], @yc[0] )
      for i in [0...@xc.length]
        if i < @xc.length - 1
          #@context.lineTo( (0.5 + @xc[i + 1]) | 0, (0.5 + @yc[i + 1]) | 0)
          @context.lineTo(@xc[i + 1], @yc[i + 1])
      #@context.lineTo(0.5 + @xc[0] | 0, (0.5 + @yc[0]) | 0)
      @context.lineTo(@xc[0], @yc[0])
      @context.closePath()
      @context.fill()
      @context.strokeStyle = 'rgba(255, 0, 0, .1)'
      @context.beginPath()
      @context.stroke()
      @context.restore()
      
    attachEvents: ->
      $("#identity span").mouseenter (e)=>
        index = $(e.target).index('span')
        @to = _shapes[index]
        @assignTarget()
        @isTweening = yes

    tweenShape: (t)->
      speed = 50
      for k in [0...@maxPoints]
        # If p1 is greater than p2
        if @x1.length >= @x2.length
          k1 = k
          k2 = 0.5 + ( k / ( @x1.length / @x2.length ) ) | 0

        else
          k1 = 0.5 + ( k / ( @x2.length / @x1.length ) ) | 0
          k2 = k
        
        p =  $.easing.easeInOutQuint( null, t % speed, 0, 1, speed)

        if t % speed is 0
          @index++
          if @index is 3
            @index = 0
          @from = @to
          @to = _shapes[@index]
          @assignTarget()
          @isTweening = no
          break
        else
          @xc[k] = @x1[k1] + p * ( @x2[k2] - @x1[k1] )
          @yc[k] = @y1[k1] + p * ( @y2[k2] - @y1[k1] )

    assignTarget: ->
      @x1 = shapes[@from].x
      @y1 = shapes[@from].y
      @x2 = shapes[@to].x
      @y2 = shapes[@to].y

