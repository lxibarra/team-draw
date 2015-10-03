'use strict';

angular.module('slatePainting', [])
  .service('QuadraticCurve', function () {
    var
      _canvas = undefined,
      _previewCanvas = undefined,
      _color = '#000000',
      _strokeWidth = 1,
      path,
      curve = [],
      cp1x,
      cp1y,
      preX,
      preY;

    function beforeDraw() {
      if (!_canvas) {
        throw 'you forgot to initialize the canvas for the QuadraticCurve service. \r\n Try using QuadraticCurve.setUp(myCanvas) before trying to draw';
      }
    }

    function setCurveLength(fallbackX, fallbackY) {
      var index = Math.round(curve.length / 2),
      selected = curve[index]||{ x:fallbackX, y:fallbackY };
      cp1x = selected.x;
      cp1y = selected.y;
      curve = [];
    }

    //must figure this out
    //aparently we have to get the difference between 2 points
    //then just make a calculation according to the mouse move
    function setCurvePreview(prevX, prevY) {
      var moveX, moveY;
      if(!preX) {
        preX = prevX;
      }

      if(!preY) {
        preY = prevY;
      }

      if(prevX > preX) {
        moveX = prevX - preX;
      } else {
        moveX = prevX - preX;
      }

      var index = Math.round(curve.length / 2);
      cp1x = curve[index].x
    }

    return {
      setUp: function (canvas, color, strokeWidth, previewCanvas) {
        try {
          _canvas = canvas.getContext("2d");
          _previewCanvas = previewCanvas.getContext("2d");
        }
        catch (e) {
          console.error(e);
        }
        _color = color;
        _strokeWidth = strokeWidth;
      },
      setCurve: function (x1, y1) {
        curve.push({x: x1, y: y1});

        /*=====All of this is bad=====*/
        if(_previewCanvas) {
          //must implement something nice

        }
        /*=============================*/
      },
      draw: function (x, y, fill) {
        setCurveLength(x+100, y+100);
        path.quadraticCurveTo(cp1x, cp1y, x, y);
        _canvas.stroke(path);
        if(fill) {
          _canvas.fill(path);
        }
      },
      startDraw: function (x, y) {
        path = new Path2D();
        path.moveTo(x, y);
      }
    }

  });
