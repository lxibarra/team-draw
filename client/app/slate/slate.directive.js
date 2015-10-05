'use strict';

angular.module('slatePainting')
  .directive('slate', function (Pencil, Circle, Eraser) {
    return {
      restrict: 'EA',
      scope:{
        layers:'=layers'
      },
      link: function (scope, element, attrs) {
        var canvasCollection = [];
        scope.layers.forEach(function(layer) {
          var canvas = angular.element('<canvas/>');
          canvas.attr('width', attrs.width);
          canvas.attr('draggable', 'false');
          canvas.attr('height', attrs.height);
          canvas.attr('id', layer.id);
          canvas.css({ 'position':'absolute'  });
          canvasCollection.push(canvas);
          element.append(canvas);
        });

        //draw dummy figures
        var canvas = canvasCollection[2][0];
        if (canvas.getContext) {
          var ctx = canvas.getContext('2d');

          ctx.fillRect(25,25,100,100);
          ctx.clearRect(45,45,60,60);
          ctx.strokeRect(50,50,50,50);
        }

        //we create a preview canvas
        var previewCanvas = angular.element('<canvas/>');
        previewCanvas.attr('width', attrs.width);
        previewCanvas.attr('draggable', 'false');
        previewCanvas.attr('height', attrs.height);
        previewCanvas.css({ 'position':'absolute'  });
        previewCanvas.attr('id', 'previewLayer');
        element.append(previewCanvas);

        element.append('<div style="clear:both;"/>');

        Eraser.setUp(canvasCollection[2][0], previewCanvas[0], 50);
        //circle.setUp(canvasCollection[2][0], previewCanvas[0]);

        /*
        circle.setBorderWidth(5);
        circle.setFillable(false);
        circle.setBorderColor('pink');
        circle.setFillColor('red');*/

        element.on('mousemove', function(evt) {
          Eraser.previewEraser(evt.offsetX, evt.offsetY);
          if(evt.buttons == 1) {
            Eraser.clear(evt.offsetX, evt.offsetY);
            //draw figures
            //circle.setRadius(evt.offsetX, evt.offsetY);
          //  Pencil.draw(evt.offsetX, evt.offsetY);
          }
        });

        element.on('click', function(evt) {
          Eraser.clear(evt.offsetX, evt.offsetY);
        });

        element.on('mouseup', function(evt) {
          //circle.draw();
        });

        element.on('mousedown', function(evt) {
         // Pencil.startDraw(evt.offsetX, evt.offsetY);
          //circle.startDraw(evt.offsetX, evt.offsetY);
        });


      }
    };
  });
