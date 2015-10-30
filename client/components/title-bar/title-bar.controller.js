'use strict';

angular.module('teamDrawApp')
  .controller('TitleBarCtrl', function ($scope, Auth, $location) {

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    };

    $scope.signIn = function() {
      $location.path('/login');
    };

    $scope.register = function() {
      $location.path('/signup');
    }

  });
