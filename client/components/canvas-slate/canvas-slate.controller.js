'use strict';
angular.module('teamDrawApp').controller('CanvasSlateCtrl', function ($scope, $routeParams, inviteResource, Auth, socket, lzw, historyResource, checkSum) {

  var doc_id = $routeParams.id,
      imageData = 'empty',
      drawActions = []; //for undo/redo if implemene


  $scope.document = doc_id;
  /**
   * Joins user socket to current document.
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

  /**
   * This callback executes after all the layers have been created by the slate directive.
   * After they haven been created a reques is made to download the latest snapshot of the layer/image and paint it
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


  /**
   * Emits a message whenever the current tool changes in configuration.
   */
  $scope.$on('toolBar/setUpTool', function (event, setUpTool) {
    $scope.setUpTool = setUpTool;
  });

});
