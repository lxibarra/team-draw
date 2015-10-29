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
    $scope.newNotifications = false;
    $scope.notifications = [];

    $scope.logout = function () {
      Auth.logout();
      $location.path('/login');
    };

    $scope.openNotifications = function ($mdOpenMenu, ev) {
      $scope.newNotifications = false;
      if ($scope.notifications.length > 0) {
        $mdOpenMenu(ev);
      }
    };

    notificationResource.latest().$promise.then(function (data) {
      var items = $scope.notifications.concat(data);
      $scope.notifications = items;
    });


    /* This methods could be abstracted in a service for easy integration in different parts of the application */
    socket.socket.on('message', function (data) {
      console.log(data);
    });

    socket.socket.on('invite', function (invite) {

      soundBlaster.newInvitation();
      $mdToast.show(
        $mdToast.simple()
          .content('New Invitation from ' + invite.userFrom.name)
          .position('left')
          .hideDelay(3000)
      );

      addInvitationGuiNotfication(invite);
    });

    function addInvitationGuiNotfication(data) {
      $scope.newNotifications = true;
      //If an invitation is from the same user to the same document, remove the old on and add the new one
      //currently we can have repeated invites on the gui

      $scope.notifications.unshift(data);
      if ($scope.notifications.length > 10) {
        $scope.notifications.pop();
      }
    }

    $scope.notificationClick = function (item) {
      if (item.notificationType.type == 'invite') {
        var confirm = $mdDialog.confirm()
          .title('Accept Invitation?')
          .content(item.userFrom.name + ' has invited you to work on a document')
          .ariaLabel('Accept invitation')
          .ok('Accept')
          .cancel('Ignore');

        $mdDialog.show(confirm).then(function () {
          //will accept invitation and show a popup if you wish to go there
          alert('You have accepted');
        }, function () {
          //cancel removal
          alert('You have rejected the invite');
        });
      }
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
      $location.path('/documents/drawing/' + item._id).replace().reload(false);
    };

    $scope.createDrawing = function () {
      drawingResource.save({}).$promise.then(function (_drawing) {
        $location.path('/documents/drawing/' + _drawing._id);
      }).catch(function () {
        //unable to create document
      });


    };

  });
