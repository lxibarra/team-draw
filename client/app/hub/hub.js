'use strict';

angular.module('teamDrawApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/hub', {
        templateUrl: 'app/hub/hub.html',
        controller: 'HubCtrl',
        authenticate:true
      });
  });
