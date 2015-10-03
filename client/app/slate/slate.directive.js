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
        previewCanvas.attr('id', layer.id);

        element.append('<div style="clear:both;"/>');

        QuadraticCurve.setUp(canvasCollection[2][0], 'blue', 5, previewCanvas);

        var ctx = canvasCollection[2][0].getContext("2d");
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (10, 10, 55, 50);

        ctx.fillStyle = "rgba(0, 0, 200, 1)";
        ctx.fillRect (30, 30, 55, 50);

       // var draw = false;

        element.on('mousemove', function(evt) {
          if(evt.buttons == 1) {
            //dra for pencil
            QuadraticCurve.setCurve(evt.offsetX, evt.offsetY);
          }
        });

        element.on('mouseup', function(evt) {
          QuadraticCurve.draw(evt.offsetX, evt.offsetY, true);
        });

        element.on('mousedown', function(evt) {
          QuadraticCurve.startDraw(evt.offsetX, evt.offsetY);
        });


      }
    };
  });
