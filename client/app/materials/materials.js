'use strict';

angular.module('teamDrawApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/documents/drawing/:id', {
        templateUrl: 'app/materials/materials.html',
        controller: 'MaterialsCtrl',
        authenticate:true
      });
  });
