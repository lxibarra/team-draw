'use strict';
angular.module('teamDrawApp').controller('CanvasSlateCtrl', function ($scope, $routeParams, inviteResource, Auth, socket, lzw, historyResource) {

  var doc_id = $routeParams.id,
    image_data,
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

//http://stackoverflow.com/questions/4409445/base64-png-data-to-html5-canvas
  //see the above link to fix draw in canvas
  $scope.onCanvasReady = function (layers) {
    console.log(layers);
    historyResource.layers({id: doc_id}).$promise.then(function (data) {
      data.forEach(function (item) {
        console.log('Item: ', item);
       // var draw = lzw.unzip(item['0'].data);
        var draw = item['0'].data;
        console.log('Image: ', draw);
        //console.log(item['0'].userId);
        //console.log(angular.element('#' + item['0'].userId));
        angular.element('#' + item['0'].userId)[0].getContext("2d").drawImage(draw, 0, 0);
      });

    }).catch(function (err) {
      console.log('Fatal Error: ', err);
    });
  };


  $scope.compressCanvas = function () {
    var _image_data = angular.element('#' + $scope.userId)[0].toDataURL("image/png", 1.0);
    if (_image_data !== image_data) {
      image_data = _image_data;
     // var packed = lzw.zip(image_data);
      socket.socket.emit('change_drawing_history', {
        userId: $scope.userId,
        document: doc_id,
        data: image_data
      });
    }
  };

  $scope.clicked = function () {

  };
  //have to receive toolbar changes
  //$scope.setUpTool

  $scope.$on('toolBar/setUpTool', function (event, setUpTool) {
    $scope.setUpTool = setUpTool;
  });

  angular.element('#drawing').on('click', function () {
    console.log('Concentrate');
  });

});
