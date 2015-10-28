'use strict';

angular.module('slatePainting')
  .directive('slate', function (slateCmd) {
    return {
      restrict: 'EA',
      scope: {
        layers: '=layers',       //user layers
        setUpTool: '=setUpTool', //Current tool of use
        userId:'=userId',        //database user id
        socket:'=socket',        //Instance of the socket to use
        document:'=document',    //Database id of the document to use
        onmouseup:'=onmouseup',  //Event to execute on mouseup (save a snapshot for example)
        onCanvasReady:'=oncanvasready' //Event that executes when all the layers/canvas have been added to the DOM
      },
      link: function (scope, element, attrs) {
        var canvasCollection = [],
            Tool = undefined,     //will hold Tool name
            remoteSettings = undefined; //Wil hold settings for the tool
           // firstLoad = true;

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
              var repeated = -1, cnv;
              canvasCollection.forEach(function(item, i) {
                if(item[0].id == user.participant._id) {
                  cnv = item;
                  repeated = i;
                }
              });

              if(repeated == -1) {
                canvasCollection.push(canvas);
                element.append(canvas);
              } else {
                //canvasCollection.splice(repeated, 1);
                //element.remove(cnv);
                //angular.element('#' + cnv[0].id).remove();
              }

            });
            if(angular.isFunction(scope.onCanvasReady)) {
                 scope.onCanvasReady(userLayer)
            }
          }
        }, true);


        //we create a preview canvas
        var previewCanvas = angular.element('<canvas/>');
        previewCanvas.attr('width', attrs.width);
        previewCanvas.attr('draggable', 'false');
        previewCanvas.attr('height', attrs.height);
        previewCanvas.css({'position': 'absolute', 'z-index':'40'});
        previewCanvas.attr('id', 'previewLayer');
        element.append(previewCanvas);

        element.append('<div style="clear:both;"/>');

        scope.$watch('setUpTool', function (newValue) {
          if (newValue) {

            Tool = newValue.Tool;
            remoteSettings = newValue.args;

            //the index of the canvasCollection must be looked up depending on the Session.User.id canvasCollection[userIndex][0]
            var layerIndex = -1;
            canvasCollection.forEach(function(_jQcanvas, index) {
                if(_jQcanvas[0].id == scope.userId) {
                  layerIndex = index;
                }
            });

            //this initializes the new tool
            slateCmd.exec(newValue.Tool, [], [canvasCollection[layerIndex][0], previewCanvas[0]].concat(newValue.args));
          }
        }, true);


        element.on('mousemove', function (evt) {
          slateCmd.exec(Tool, ['mousemove'], [evt.offsetX, evt.offsetY]);
         // socketCommunicate('draw', [Tool, ['mousemove'], [evt.offsetX, evt.offsetY]]);
          if (evt.buttons == 1) {
            slateCmd.exec(Tool, ['mousemove', 'mousedown'], [evt.offsetX, evt.offsetY]);
            socketCommunicate('draw', [Tool, ['remote mousemove', 'remote mousedown'], [scope.userId, evt.offsetX, evt.offsetY].concat(remoteSettings)]);
          }
        });

        element.on('click', function (evt) {
          slateCmd.exec(Tool, ['click'], [evt.offsetX, evt.offsetY]);
          socketCommunicate('draw', [Tool, ['remote click'], [scope.userId, evt.offsetX, evt.offsetY].concat(remoteSettings)]);
        });

        element.on('mouseup', function (evt) {
          slateCmd.exec(Tool, ['mouseup'], [evt.offsetX, evt.offsetY]);
          socketCommunicate('draw', [Tool, ['remote mouseup'], [scope.userId, evt.offsetX, evt.offsetY].concat(remoteSettings)]);
          if(scope.onmouseup) {
            scope.onmouseup();
          }
        });

        element.on('mousedown', function (evt) {
          slateCmd.exec(Tool, ['mousedown'], [evt.offsetX, evt.offsetY]);
          socketCommunicate('draw', [Tool, ['remote mousedown'], [scope.userId, evt.offsetX, evt.offsetY].concat(remoteSettings)]);
        });

        /**
         * Socket communication
         * */

        /**
         * Receive data from remote users
         */
        scope.socket.on('draw', function(data) {
            if(data.userId !== scope.userId) {
              slateCmd.exec.apply(slateCmd, data.data);
            }
        });

        /**
         * Send data to remote users
         * @param event we want to communicate, most likely draw
         * @param data
         */
        function socketCommunicate(event, data) {
          if(scope.socket) {
            scope.socket.emit(event, {
              document:scope.document,
              userId:scope.userId, //This is also the canvas id
              data:data //Array of parameters needed for
            });
          }
        }
      }
    };
  });
