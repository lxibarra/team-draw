'use strict';
angular.module('teamDrawApp').controller('CanvasSlateCtrl', function ($scope, $routeParams, inviteResource, Auth, socket) {

  var doc_id = $routeParams.id;
  $scope.document = doc_id;
  socket.socket.emit('join', { document:doc_id });
  $scope.userId = Auth.getCurrentUser()._id;
  $scope.socket = socket.socket;
  console.log('Socket on controller: ', $scope.socket);
  $scope.layers = [];
  inviteResource.layers({additional: doc_id}).$promise.then(function (data) {
    data.forEach(function (i) {
      $scope.layers.push(i);
    });

  });


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
