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
        document:'=document',
        onmouseup:'=onmouseup',
        onCanvasReady:'=oncanvasready'
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
            if(angular.isFunction(scope.onCanvasReady)) {
              console.log('executed canvas ready');
              scope.onCanvasReady(userLayer)
            }
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
//          console.log(angular.element('#' + scope.userId)[0].getContext("2d").getImageData(0,0, 30, 30));
           // var compressed = lzwCompress.pack(angular.element('#' + scope.userId)[0].getContext("2d").getImageData(0,0, 640, 480));
         /*
          var data = angular.element('#' + scope.userId)[0].toDataURL("image/png", 1.0);
            console.log(data, data.length);
          var compressed = lzwCompress.pack(data);
          console.log(compressed, compressed.length);

          var uncompressed = lzwCompress.unpack(compressed);
          console.log(uncompressed);
          */
//          var x = angular.element('#' + scope.userId)[0].getContext("2d");

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
