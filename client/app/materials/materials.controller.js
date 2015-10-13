'use strict';
//remove color from here after its not necessary
angular.module('teamDrawApp')
    .controller('MaterialsCtrl', function ($scope, $routeParams, drawingResource, $location) {

    $scope.doc = {};
    drawingResource.get({drawingId:$routeParams.id}).$promise.then(function(document) {
      $scope.doc = document;
    }).catch(function(err) {
       setTimeout(function() {
         $location.path('/hub').replace();
       },200);
    });

  });
