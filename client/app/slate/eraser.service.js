'use strict';

/**
 * Setup eraser
 * How to use this service
 *
 * Initialize component with the target canvas and the preview canvas to
 * draw the eraser preview
 *
 * Eraser.setUp(targetCanvas, previewCanvas, blockSize);
 *
 * On mouse move you want to show the eraser as the user moves its mouse
 * over the canvas. But, if the left button is down the user wants to delete.
 *
 * element.on('mousemove', function(evt) {
    Eraser.previewEraser(evt.offsetX, evt.offsetY);
      if(evt.buttons == 1) {
        Eraser.clear(evt.offsetX, evt.offsetY);
      }
   });
 *
 *
 * On click we may want to delete a certain area
 *
 * element.on('click', function(evt) {
          Eraser.clear(evt.offsetX, evt.offsetY);
   });
 *
 *
 *
 *
 */

angular.module('slatePainting').service('Eraser', function() {
  var
    _canvas = undefined,
    _previewCanvas = undefined,
    _blockSize = 0,
    sizeX,
    sizeY;

  function beforeDraw() {
    if (!_canvas) {
      throw 'you forgot to initialize the canvas for the Eraser service. \r\n Try using Eraser.setUp(myCanvas) before trying to clear';
    }
    if (!_previewCanvas) {
      throw 'you forgot to initialize the canvas for the Eraser Preview service. \r\n Try using Eraser.setUp(myCanvas, myPreviewCanvas) before trying to clear';
    }
  }

  function clearCanvas(target) {
    target.clearRect(0, 0, sizeX||0, sizeY||0);
  }

  return {
    setUp:function(canvas, previewCanvas, blockSize) {
      try {
        _canvas = canvas.getContext("2d");
        _previewCanvas = previewCanvas.getContext("2d");
        sizeX = _canvas.canvas.width;
        sizeY = _canvas.canvas.height;
      } catch(e) {
        console.error(e);
      }
      _blockSize = blockSize||0;
      if(_blockSize > 0) {
        _blockSize = Math.ceil(_blockSize / 2);
      }
    },
    previewEraser:function(x,y) {
      beforeDraw();
      clearCanvas(_previewCanvas);
      _previewCanvas.beginPath();
      _previewCanvas.rect(x, y, _blockSize, _blockSize);
      _previewCanvas.fillStyle = 'white';
      _previewCanvas.fill();
      _previewCanvas.lineWidth = 1;
      _previewCanvas.strokeStyle = '#cccccc';
      _previewCanvas.stroke();

    },
    clear:function(x, y) {
      beforeDraw();
      _canvas.clearRect(x, y , _blockSize, _blockSize);
    }
  }

});
