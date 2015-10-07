'use strict';

/**
 * Setup Circle
 * How to use this service
 *
 * Initialize component using the setup method, only the target canvas is mandatory
 *
 * circle.setUp(targetCanvas, previewCanvas);
 *
 * after that set a listener for starting the circle
 *
 * element.on('mousedown', function(evt) {
          circle.startDraw(evt.offsetX, evt.offsetY);
    });
 *
 * Use setters to customize circle properties (default values are provided)
 *
 * circle.setBorderWidth(5);
 * circle.setFillable(false);
 * circle.setBorderColor('pink');
 * circle.setFillColor('red');
 *
 * To allow the user to drag a circle do the following. If a preview canvas was provided it will show
 *
 * element.on('mousemove', function(evt) {
      if(evt.buttons == 1) {
            circle.preview(evt.offsetX, evt.offsetY);
      }
   });
 *
 *
 * To draw the final circle into the canvas use the draw method.
 *
 *  element.on('mouseup', function(evt) {
          circle.draw();
    });
 */

angular.module('slatePainting', [])
  .service('Circle', function () {
    var
      _canvas = undefined,
      _previewCanvas = undefined,
      _color = '#000000',
      _strokeWidth = 2,
      _fill = false,
      _fillColor = 'orange',
      sizeX,
      sizeY,
      cp1x,
      cp1y,
      radius = 0;

    function beforeDraw() {
      if (!_canvas) {
        throw 'you forgot to initialize the canvas for the Circle service. \r\n Try using QuadraticCurve.setUp(myCanvas) before trying to draw';
      }
    }

    function makeCircle(target) {
      beforeDraw(); //added on last minute if something goes wrong remove
      target.beginPath();
      target.lineWidth = _strokeWidth;
      target.strokeStyle = _color;
     // target.fillStyle = _fillColor;
      target.arc(cp1x, cp1y, radius, 0, 2 * Math.PI, true);
      target.stroke();
      if (_fill) {
        target.fillStyle = _fillColor;
        target.fill();
      }
    }

    function clearCanvas(target) {
      target.clearRect(0, 0, sizeX, sizeY);
    }

    function setRadius (x1, y1) {
      var dx = cp1x > x1 ? (cp1x - x1) : (x1 - cp1x);
      var dy = cp1y > y1 ? (cp1y - y1) : (y1 - cp1y);
      radius = Math.sqrt((dx * dx) + (dy * dy));
      radius = Math.floor(radius / 2);
      if (_previewCanvas) {
        clearCanvas(_previewCanvas);
        makeCircle(_previewCanvas);
      }
    }

    return {
      setUp: function (canvas, previewCanvas, strokeWidth, color, fillColor, fill) {
        try {
          _canvas = canvas.getContext("2d");
          _previewCanvas = previewCanvas.getContext("2d");
          sizeX = _canvas.canvas.width;
          sizeY = _canvas.canvas.height;
        }
        catch (e) {
          console.error(e);
        }
        _color = color || _color;
        _strokeWidth = strokeWidth || _strokeWidth;
        _fill = fill;
        _fillColor = fillColor || _fillColor;

      },
      preview: function (x1, y1) {
        setRadius(x1, y1);
      },
      draw: function () {
        clearCanvas(_previewCanvas);
        makeCircle(_canvas);
      },
      startDraw: function (x, y) {
        radius = 0;
        cp1x = x;
        cp1y = y;
      },
      setBorderWidth: function (value) {
        if (value != Number.NaN && value >= 0) {
          _strokeWidth = parseInt(value);
        } else {
          console.error('Invalid circle border width, expecting integer greater or equal to 0 and got ', value);
        }
      },
      setBorderColor:function(value) {
          _color = value||_color;
      },
      setFillable: function (value) {
        _fill = value ? true : false;
      },
      setFillColor:function(value) {
        _fillColor = value||_fillColor;
      }
    }

  });
