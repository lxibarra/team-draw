'use strict';

angular.module('slatePainting')
  .directive('slate', function (Pencil, QuadraticCurve) {
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
          canvas.css({ 'background-color': layer.color, 'opacity':.5, 'position':'absolute'  });
          canvasCollection.push(canvas);
          element.append(canvas);
        });
        //we create a preview canvas
        var previewCanvas = angular.element('<canvas/>');
        previewCanvas.attr('width', attrs.width);
        previewCanvas.attr('draggable', 'false');
        previewCanvas.attr('height', attrs.height);
        previewCanvas.css({ 'position':'absolute'  });
        previewCanvas.attr('id', 'previewLayer');
        element.append(previewCanvas);

        element.append('<div style="clear:both;"/>');

        QuadraticCurve.setUp(canvasCollection[2][0], 'blue', 5, previewCanvas);



        element.on('mousemove', function(evt) {
          if(evt.buttons == 1) {
            //dra for pencil
            QuadraticCurve.setCurve(evt.offsetX, evt.offsetY);
          //  Pencil.draw(evt.offsetX, evt.offsetY);
          }
        });

        element.on('mouseup', function(evt) {
          QuadraticCurve.draw(evt.offsetX, evt.offsetY, true);
        });

        element.on('mousedown', function(evt) {
         // Pencil.startDraw(evt.offsetX, evt.offsetY);
          QuadraticCurve.startDraw(evt.offsetX, evt.offsetY);
        });


      }
    };
  });
