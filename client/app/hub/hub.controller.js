'use strict';

angular.module('teamDrawApp')
  .controller('HubCtrl', function ($scope,
                                   drawingResource,
                                   $location,
                                   $mdDialog,
                                   Auth,
                                   socket,
                                   $mdToast,
                                   notificationResource,
                                   soundBlaster,
                                   inviteResource) {

    var currentDocs = false;
    $scope.User = Auth.getCurrentUser();

    $scope.logout = function () {
      Auth.logout();
      $location.path('/login');
    };


    function fetOwnDocs() {
      EnableDisableButtons('disable');
      drawingResource.collection({additional: 1}).$promise.then(function (data) {
        EnableDisableButtons('enable');
        $scope.documentList = data;
      }).catch(function (err) {
        EnableDisableButtons('enable');
        currentDocs = false;
      });
    }

    $scope.getMine = function (e) {

      fetOwnDocs();
    };

    fetOwnDocs();

    function EnableDisableButtons(event) {
      if(event === 'enable') {
        angular.element('#btnAction button').removeAttr('disabled');
      } else {
        angular.element('#btnAction button').attr('disabled', 'disabled');
      }

    }

    $scope.getShared = function (id) {
      EnableDisableButtons('disable');
      //angular.element(id).attr('disabled', 'disabled');
      inviteResource.shared({}).$promise.then(function (data) {
        $scope.documentList = data;
        EnableDisableButtons('enable');
      }).catch(function (err) {
        EnableDisableButtons('enable');
      })
    };

    $scope.goToDocument = function (item) {
      window.location = '/documents/drawing/' + item._id;
    };

    $scope.createDrawing = function () {
      drawingResource.save({}).$promise.then(function (_drawing) {

        window.location = '/documents/drawing/' + _drawing._id;
      }).catch(function () {
        //unable to create document
      });
    };

  });
