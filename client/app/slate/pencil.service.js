'use strict';

/**
 * Setup of events
 * How to use this service
 *
 * Setup (call it before anything else)
 *  Pencil.setUp(canvasObject, color=optional, strokeWidth=optional);
 *
 * Start Drawing (most likely on mouse down prepare service to draw from current coordinates)
 *
 *  Pencil.startDraw(x, y);
 *
 * most Likely
 *  element.on('mousedown', function(evt) {
 *    Pencil.startDraw(evt.offsetX, evt.offsetY);
 *  }
 *
 * User is drawing
 *
 *   element.on('mousemove', function(evt) {
 *      if(evt.buttons == 1) {
 *           Pencil.draw(evt.offsetX, evt.offsetY);
 *      }
 *   });
 */

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
