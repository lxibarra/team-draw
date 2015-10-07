'use strict';

angular.module('slatePainting')
  .directive('slate', function (slateCmd) {
    return {
      restrict: 'EA',
      scope: {
        layers: '=layers',
        setUpTool: '=setUpTool'
      },
      link: function (scope, element, attrs) {
        var canvasCollection = [],
            Tool = undefined;
        scope.layers.forEach(function (layer) {
          var canvas = angular.element('<canvas/>');
          canvas.attr('width', attrs.width);
          canvas.attr('draggable', 'false');
          canvas.attr('height', attrs.height);
          canvas.attr('id', layer.id);
          canvas.css({'position': 'absolute'});
          canvasCollection.push(canvas);
          element.append(canvas);
        });

        //we create a preview canvas
        var previewCanvas = angular.element('<canvas/>');
        previewCanvas.attr('width', attrs.width);
        previewCanvas.attr('draggable', 'false');
        previewCanvas.attr('height', attrs.height);
        previewCanvas.css({'position': 'absolute'});
        previewCanvas.attr('id', 'previewLayer');
        element.append(previewCanvas);

        element.append('<div style="clear:both;"/>');

        scope.$watch('setUpTool', function (newValue) {
          if (newValue) {
            Tool = newValue.Tool;
            slateCmd.exec(newValue.Tool, [], [canvasCollection[2][0], previewCanvas[0]].concat(newValue.args));
          }
        }, true);

        element.on('mousemove', function (evt) {
          slateCmd.exec(Tool, ['mousemove'], [evt.offsetX, evt.offsetY]);
          if (evt.buttons == 1) {
            slateCmd.exec(Tool, ['mousemove', 'mousedown'], [evt.offsetX, evt.offsetY]);
          }
        });

        element.on('click', function (evt) {
          slateCmd.exec(Tool, ['click'], [evt.offsetX, evt.offsetY]);
        });

        element.on('mouseup', function (evt) {
          slateCmd.exec(Tool, ['mouseup'], [evt.offsetX, evt.offsetY]);
        });

        element.on('mousedown', function (evt) {
          slateCmd.exec(Tool, ['mousedown'], [evt.offsetX, evt.offsetY]);
        });


      }
    };
  });
