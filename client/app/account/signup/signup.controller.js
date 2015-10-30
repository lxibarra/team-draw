'use strict';

angular.module('teamDrawApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};


    $scope.register = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          reCaptcha: angular.element('#g-recaptcha-response').val()
        })
          .then(function () {
            // Account created, redirect to home
            $location.path('/');
          })
          .catch(function (err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function (error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });

            angular.forEach(err.captcha, function (error, field) {
              $scope.errors['reCaptcha'] = error;
            });
          });
      }
    };

    $scope.loginOauth = function (provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
