'use strict';
angular.module('teamDrawApp').controller('CanvasSlateCtrl', function ($scope, $routeParams, inviteResource, Auth, socket, lzw, historyResource, checkSum) {

  var doc_id = $routeParams.id,
      imageData = 'empty',
      drawActions = []; //for undo/redo


  $scope.document = doc_id;
  socket.socket.emit('join', {document: doc_id});
  $scope.userId = Auth.getCurrentUser()._id;
  $scope.socket = socket.socket;

  $scope.layers = [];
  inviteResource.layers({additional: doc_id}).$promise.then(function (data) {
    data.forEach(function (i) {
      $scope.layers.push(i);
    });
  });


  $scope.onCanvasReady = function (layers) {
    //console.log(layers);
    historyResource.layers({id: doc_id}).$promise.then(function (data) {
      console.log(data);
      data.forEach(function (item) {
        //console.log('Item: ', item);
        var draw = lzw.unzip(item['0'].data);
       // var draw = item['0'].data;
        var img = new Image();
        img.src = draw;
        //console.log('Image: ', draw);
        //console.log(item['0'].userId);
        //console.log(angular.element('#' + item['0'].userId));
        angular.element('#' + item['0'].userId)[0].getContext("2d").drawImage(img, 0, 0);
      });

    }).catch(function (err) {
      console.log('Fatal Error: ', err);
    });
  };


  /**
   * Check for changes in the canvas,
   * compress the canvas base 64 string
   * Send to the database as a snapshot of the canvas
   */
  $scope.compressCanvas = function () {
    var _image_data = angular.element('#' + $scope.userId)[0].toDataURL("image/png", 1.0);
    if(!checkSum.areEqual.fromString(imageData, _image_data)) {
      console.log('Entered to save');
      imageData = _image_data;
      var packed = lzw.zip(_image_data);
      socket.socket.emit('change_drawing_history', {
        userId: $scope.userId,
        document: doc_id,
        data: packed
      });
    }

  };

  $scope.clicked = function () {

  };


  $scope.$on('toolBar/setUpTool', function (event, setUpTool) {
    $scope.setUpTool = setUpTool;
  });

  angular.element('#drawing').on('click', function () {
    console.log('Concentrate');
  });

});
