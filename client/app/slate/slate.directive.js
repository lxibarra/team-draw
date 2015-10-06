'use strict';

angular.module('slatePainting').value('$_slateAction', { })
  .directive('slate', function (slateCmd, Pencil, Circle, Eraser) {
    return {
      restrict: 'EA',
      scope:{
        layers:'=layers',
        interactor:'=interactor'
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

        //the controller will be responsible for creating the proper array depending on the shape it wants to create
        //setup for pencil
        //var tmp = 'Pencil';
        //slateCmd.exec(tmp, [] , [ canvasCollection[2][0], previewCanvas[0], 'blue', 2 ]);

        //setup for eraser
        //var tmp = 'Eraser';
        //slateCmd.exec(tmp, [] , [ canvasCollection[2][0], previewCanvas[0], 30 ]);

        //setup for Circle
        var tmp = 'Circle';
        slateCmd.exec(tmp, [], [ canvasCollection[2][0], previewCanvas[0]]);

        element.on('mousemove', function(evt) {
          slateCmd.exec(tmp, ['mousemove'], [ evt.offsetX, evt.offsetY ]);
          if(evt.buttons == 1) {
            slateCmd.exec(tmp, ['mousemove', 'mousedown'], [ evt.offsetX, evt.offsetY ]);
          }
        });

        element.on('click', function(evt) {
          slateCmd.exec(tmp, ['click'], [ evt.offsetX, evt.offsetY ]);
        });

        element.on('mouseup', function(evt) {
          slateCmd.exec(tmp, ['mouseup'], [ evt.offsetX, evt.offsetY ]);
        });

        element.on('mousedown', function(evt) {
          slateCmd.exec(tmp, ['mousedown'], [ evt.offsetX, evt.offsetY ]);
        });


      }
    };
  });
