'use strict';
//remove color from here after its not necessary
angular.module('teamDrawApp')
    .controller('MaterialsCtrl', function ($scope, $routeParams, drawingResource) {
        console.log($routeParams.id);

    var doc = {};
    drawingResource.get({drawingId:$routeParams.id}).$promise.then(function(document) {
      doc = document;
      console.log(doc);
      //broadcast object
    });

  });
