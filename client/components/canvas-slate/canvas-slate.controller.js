'use strict';
angular.module('teamDrawApp').controller('CanvasSlateCtrl', function ($scope,
                                                                      $routeParams,
                                                                      inviteResource,
                                                                      Auth,
                                                                      socket,
                                                                      lzw,
                                                                      historyResource,
                                                                      checkSum,
                                                                      imageHistory) {

  var doc_id = $routeParams.id,
      imageData = 'empty';


  $scope.document = doc_id;
  /**
   * Joins user socket to current document.
   * Should all be done on the server must switch
   */
  socket.socket.emit('join', {document: doc_id});

  $scope.userId = Auth.getCurrentUser()._id;
  $scope.socket = socket.socket;

  /**
   * the slate directive listens for changes to this scope variable. If a user logs in it should be added to this array
   * for the slate to autocreate its layer canvas.
   * @type {Array}
   */
  $scope.layers = [];

  /**
   * Fetches all the layers from the database and creates an instance on the slate
   * The slate directive must have a listener for the $scope.layers variable
   * Look into the components/canvas-slate/canvas-slate html for a general idea.
   */
  inviteResource.layers({additional: doc_id}).$promise.then(function (data) {
    data.forEach(function (i) {
      $scope.layers.push(i);
    });
  });

  //aki me quede falta poner las layers
  $scope.$on('invite/sent', function(event, rdata) {

    var data = rdata.invitePayload||rdata;

    var index = -1;
    $scope.layers.forEach(function(item, i){
     // if(item.participant._id == data.invitePayload.participant._id) {
      if(item.participant._id == data.participant._id) {
        index = i;
      }
    });

    if(index === -1) {
      $scope.layers.push(data);
    }
  });


  $scope.$on('invite/removed', function(event, data) {


    var index = -1;
    $scope.layers.forEach(function(item, i){
      if(item.participant._id == data.participant._id) {
        index = i;
      }
    });

    if(index !== -1) {
      $scope.layers.splice(index, 1);
    }
  });
  /**
   * This callback executes after all the layers have been created by the slate directive.
   * After they haven been created a request is made to download the latest snapshot of the layer/image and paint it
   * on the canvas.
   * @param layers injects an array of canvas objects currently on the canvas.
   */

  $scope.onCanvasReady = function (layers) {
   historyResource.layers({id: doc_id}).$promise.then(function (data) {
      data.forEach(function (item) {
        var draw = lzw.unzip(item['0'].data);
        var img = new Image();
        img.src = draw;
        angular.element('#' + item['0'].userId)[0].getContext("2d").drawImage(img, 0, 0);
        if(item['0'].userId == $scope.userId) {
          imageHistory.add({
            data:item['0'].data,
            document:item['0'].document,
            userId:item['0'].userId
          });
        }
      });

    }).catch(function (err) {
      console.log('Fatal Error: ', err);
    });
  };

  /**
   * Lsitener for remote events
   */
  socket.socket.on('remote:undo', function(data) {
    //This will not trigger if the same socket was the one sending the message.
    console.log('An undo was created', data);
  });

  socket.socket.on('remote:redo', function(data) {
    //This will not trigger if the same socket was the one sending the message.
    console.log('An undo was created', data);
  });

  /**
   * Listeners for local events
   */
  $scope.$on('toolBar/undo', function() {
    var state = imageHistory.undo();
   // console.log(state);
    if(state) {
      //not sure if i should stick this in here
    //  console.log(state);
      var _draw = lzw.unzip(state.data);
      var img1 = new Image();
      img1.src = _draw;
      var dom = angular.element('#' + state.userId)[0];
      var _cnv = dom.getContext("2d");
      _cnv.clearRect(0, 0, 800, 600);
      _cnv = dom.getContext("2d");
      _cnv.drawImage(img1, 0, 0);
    }
  });

  $scope.$on('toolBar/redo', function() {
    console.log('Clicked redo');
    var state = imageHistory.redo();
    drawState(state);
  });

  function drawState(state) {
    if(state) {
      var _draw = lzw.unzip(state.data);
      var img1 = new Image();
      img1.src = _draw;
      var dom = angular.element('#' + state.userId)[0];
      var _cnv = dom.getContext("2d");
      _cnv.clearRect(0, 0, 800, 600);
      _cnv = dom.getContext("2d");
      _cnv.drawImage(img1, 0, 0);
    }
  }

  /**
   * Check for changes in the canvas,
   * compress the canvas base 64 string
   * Send to the database as a snapshot of the canvas
   */
  $scope.compressCanvas = function () {
    var _image_data = angular.element('#' + $scope.userId)[0].toDataURL("image/png", 1.0);
    if(!checkSum.areEqual.fromString(imageData, _image_data)) {
      imageData = _image_data;
      var packed = lzw.zip(_image_data);
      var dataToStore = {
        userId: $scope.userId,
        document: doc_id,
        data: packed
      };
      console.log('added to history', dataToStore);
      imageHistory.add(dataToStore);
      socket.socket.emit('change_drawing_history', dataToStore);
      //to add undo/redo




    }

  };

  $scope.clicked = function () {

  };


  /**
   * Emits a message whenever the current tool changes in configuration.
   */
  $scope.$on('toolBar/setUpTool', function (event, setUpTool) {
    $scope.setUpTool = setUpTool;
  });

});
