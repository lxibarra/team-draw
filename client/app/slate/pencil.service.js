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
 *      Pencil.preview(evt.offsetX, evt.offsetY);
 *      if(evt.buttons == 1) {
 *           Pencil.draw(evt.offsetX, evt.offsetY);
 *      }
 *   });
 */

angular.module('slatePainting')
  .service('Pencil', function () {
    var
      _canvas = undefined,
      _previewCanvas = undefined,
      _color = '#000000',
      _strokeWidth = 1,
      sizeX = 0,
      sizeY = 0,
      _remoteCanvas = {};


    function beforeDraw() {
      if (!_canvas) {
        throw 'you forgot to initialize the canvas for the Pencil service. \r\n Try using Pencil.setUp(myCanvas, previewCanvas) before trying to draw';
      }

      if (!_previewCanvas) {
        throw 'you forgot to initialize the preview canvas for the Pencil service. \r\n Try using Pencil.setUp(myCanvas, previewCanvas) before trying to draw';
      }
    }

    function clearCanvas(target) {
      target.clearRect(0, 0, sizeX || 0, sizeY || 0);
    }

    function setRemoteCanvas(id) {
      if(_remoteCanvas[id]) {
        return _remoteCanvas[id];
      }
                          //Hate the selector here
      _remoteCanvas[id] = angular.element('#' + id)[0].getContext("2d");
      return _remoteCanvas[id];
    }

    return {
      setUp: function (canvas, previewCanvas, strokeWidth, color) {
        try {
          _canvas = canvas.getContext("2d");
          _previewCanvas = previewCanvas.getContext("2d");
          sizeX = _canvas.canvas.width;
          sizeY = _canvas.canvas.height;
        }
        catch (e) {
          console.error(e);
        }
        _color = color;
        _strokeWidth = strokeWidth;
      },
      preview: function (x, y) {
        beforeDraw();
        clearCanvas(_previewCanvas);
        _previewCanvas.beginPath();
        _previewCanvas.rect(x, y, _strokeWidth, _strokeWidth);
        _previewCanvas.fillStyle = _color;
        _previewCanvas.fill();
        _previewCanvas.stroke();
      },
      draw: function (x, y) {
        beforeDraw();
        _canvas.lineTo(x, y);
        _canvas.lineWidth = _strokeWidth;
        _canvas.strokeStyle = _color;
        _canvas.stroke();
      },
      startDraw: function (x, y) {
        beforeDraw();
        _canvas.beginPath();
        _canvas.moveTo(x, y);
      },
      startQuickDraw: function (canvasId, x, y) {
        try {
          var _ACanvas = setRemoteCanvas(canvasId);
          _ACanvas.beginPath();
          _ACanvas.moveTo(x, y);
        } catch (ex) {
          console.log(ex);
          //Silently fail remote errors.
        }
      },
      quickDraw: function (canvasId, x, y, strokeWidth, color) {
        try {
          var _ACanvas = setRemoteCanvas(canvasId);
          _ACanvas.lineTo(x, y);
          _ACanvas.lineWidth = strokeWidth;
          _ACanvas.strokeStyle = color;
          _ACanvas.stroke();
        } catch (ex) {
          console.log(ex);
          //Silently fail remote errors.
        }
      },

      setColor: function (color) {
        _color = color;
      },
      setStrokeWidth: function (strokeWidth) {
        _strokeWidth = strokeWidth;
      }
    }
  });
