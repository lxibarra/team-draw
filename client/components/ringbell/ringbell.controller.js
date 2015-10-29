'use strict';

angular.module('teamDrawApp').controller('RingBellCtrl', function ($scope,
                                                                   notificationResource,
                                                                   soundBlaster,
                                                                   $mdToast, socket, $mdDialog
) {


  $scope.notifications = [];

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
    console.log(item);
    if (item.notificationType.code == 'invite') {
      var confirm = $mdDialog.confirm()
        .title('Accept Invitation?')
        .content(item.userFrom.name + ' has invited you to work on a document')
        .ariaLabel('Open document')
        .ok('Open Document')
        .cancel('Ignore for now');

      $mdDialog.show(confirm).then(function () {
        //will accept invitation and show a popup if you wish to go there
        window.location = '/documents/drawing/' + item.document;
      }, function () {
        //cancel removal
        alert('You have rejected the invite');
      });
    }
  };

});
