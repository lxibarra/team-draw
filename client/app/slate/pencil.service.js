'use strict';

angular.module('slatePainting')
  .service('Pencil', function () {
    var
      _canvas = undefined,
      _color = '#000000',
      _strokeWidth = 1;


    function beforeDraw() {
      if(!_canvas) {
        throw 'you forgot to initialize the canvas for the Pencil service. \r\n Try using Pencil.setUp(myCanvas) before trying to draw';
      }
    }

    return {
      setUp: function (canvas, color, strokeWidth) {
        try {
          _canvas = canvas.getContext("2d");
        }
        catch(e){
          console.error(e);
        }
        _color = color;
        _strokeWidth = strokeWidth;
      },
      draw:function(x, y){
        beforeDraw();
        _canvas.lineTo(x, y);
        _canvas.lineWidth = _strokeWidth;
        _canvas.strokeStyle = _color;
        _canvas.stroke();
      },
      startDraw:function(x, y) {
        beforeDraw();
        _canvas.beginPath();
        _canvas.moveTo(x, y);
      },
      setColor:function(color) {
        _color = color;
      },
      setStrokeWidth:function(strokeWidth) {
        _strokeWidth = strokeWidth;
      }
    }
  });
