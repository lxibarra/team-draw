'use strict';

angular.module('teamDrawApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/materials', {
        templateUrl: 'app/materials/materials.html',
        controller: 'MaterialsCtrl'
      });
  });
