'use strict';

angular.module('slatePainting')
  .directive('slate', function (slateCmd) {
    return {
      restrict: 'EA',
      scope: {
        layers: '=layers',
        setUpTool: '=setUpTool',
        userId:'=userId',
        socket:'=socket',
        document:'=document'
      },
      link: function (scope, element, attrs) {
        var canvasCollection = [],
            Tool = undefined;
        scope.$watch('layers', function(userLayer) {
          if(userLayer.length > 0) {
            userLayer.forEach(function(layer) {
              var user = layer;
              var canvas = angular.element('<canvas/>');
              canvas.attr('width', attrs.width);
              canvas.attr('draggable', 'false');
              canvas.attr('height', attrs.height);
              canvas.attr('id', user.participant._id);
              canvas.css({'position': 'absolute'});
              var repeated;
              canvasCollection.forEach(function(item) {
                if(item[0].id == user._id) {
                  repeated = item;
                }
              });

              if(typeof repeated === 'undefined') {
                canvasCollection.push(canvas);
                element.append(canvas);
              }
            });
          }
        }, true);

        /*scope.layers.forEach(function (layer) {
          var canvas = angular.element('<canvas/>');
          canvas.attr('width', attrs.width);
          canvas.attr('draggable', 'false');
          canvas.attr('height', attrs.height);
          canvas.attr('id', layer._id);
          canvas.css({'position': 'absolute'});
          canvasCollection.push(canvas);
          element.append(canvas);
        });*/



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
            //the index of the canvasCollection must be looked up depending on the Session.User.id canvasCollection[userIndex][0]
            var layerIndex = -1;
            canvasCollection.forEach(function(_jQcanvas, index) {
                if(_jQcanvas[0].id == scope.userId) {
                  layerIndex = index;
                }
            });

            slateCmd.exec(newValue.Tool, [], [canvasCollection[layerIndex][0], previewCanvas[0]].concat(newValue.args));
          }
        }, true);


        element.on('mousemove', function (evt) {
          slateCmd.exec(Tool, ['mousemove'], [evt.offsetX, evt.offsetY]);
         // socketCommunicate('draw', [Tool, ['mousemove'], [evt.offsetX, evt.offsetY]]);
          if (evt.buttons == 1) {
            slateCmd.exec(Tool, ['mousemove', 'mousedown'], [evt.offsetX, evt.offsetY]);
            socketCommunicate('draw', [Tool, ['mousemove', 'mousedown'], [evt.offsetX, evt.offsetY]]);
          }
        });

        element.on('click', function (evt) {
          slateCmd.exec(Tool, ['click'], [evt.offsetX, evt.offsetY]);
          socketCommunicate('draw', [['click'], [evt.offsetX, evt.offsetY]]);
        });

        element.on('mouseup', function (evt) {
          slateCmd.exec(Tool, ['mouseup'], [evt.offsetX, evt.offsetY]);
          socketCommunicate('draw', [Tool, ['mouseup'], [evt.offsetX, evt.offsetY]]);
        });

        element.on('mousedown', function (evt) {
          slateCmd.exec(Tool, ['mousedown'], [evt.offsetX, evt.offsetY]);
          socketCommunicate('draw', [Tool, ['mousedown'], [evt.offsetX, evt.offsetY]]);
        });

        /**
         * Socket communication
         * */

        scope.socket.on('draw', function(data) {
            console.log('Trying to call exec with ', data.data );
            if(data.userId !== scope.userId) {
              console.log('Called apply on slateCmd.exec');
              slateCmd.exec.apply(slateCmd, data.data);
            }
        });

        function socketCommunicate(event, data) {
          if(scope.socket) {
            scope.socket.emit(event, {
              document:scope.document,
              userId:scope.userId,
              data:data
            });
          }
        }
      }
    };
  });
