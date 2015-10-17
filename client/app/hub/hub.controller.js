'use strict';

angular.module('teamDrawApp')
  .controller('HubCtrl', function ($scope, drawingResource, $location,$mdDialog, Auth, socket, $mdToast, $compile) {

    $scope.User = Auth.getCurrentUser();
    $scope.newNotifications = false;
    //We should get the top ten notifications here

    $scope.openNotifications = function ($mdOpenMenu, ev) {
      $scope.newNotifications = false;
      if ($scope.notifications.length > 0) {
        $mdOpenMenu(ev);
      }
    }

    $scope.notifications = [];
    
    /* This methods could be abstracted in a service for easy integration in different parts of the application */
    socket.socket.on('message', function (data) {
      console.log(data);
    });

    socket.socket.on('invite', function (invite) {
      $mdToast.show(
        $mdToast.simple()
          .content('New Invitation from ' + invite.userName)
          .position('left')
          .hideDelay(3000)
        );

      addInvitationGuiNotfication(invite);
    });

    function addInvitationGuiNotfication(data) {
      $scope.newNotifications = true;
      //If an invitation is from the same user to the same document, remove the old on and add the new one
      //currently we can have repeated invites on the gui
      $scope.notifications.push(data);
    }

    $scope.notificationClick = function (item) {
      if (item.notificationType.type == 'invite') {
        var confirm = $mdDialog.confirm()
          .title('Accept Invitation?')
          .content(item.userName + ' has invited you to work on a document')
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
    }

    //demo data
    $scope.documentList = [
      { _id: 1, name: 'Mountain high', owner: 'ricardo' },
      { _id: 2, name: 'Over the clouds', owner: 'ricardo' },
      { _id: 3, name: 'Home sweet home', owner: 'ricardo' },
      { _id: 4, name: 'My favorite place', owner: 'ricardo' },
      { _id: 5, name: 'Solana beach', owner: 'ricardo' },
      { _id: 6, name: 'School gardens', owner: 'ricardo' },
      { _id: 7, name: 'Statues', owner: 'ricardo' },
      { _id: 8, name: 'Some doc', owner: 'ricardo' },
      { _id: 9, name: 'Delete me', owner: 'ricardo' },
      { _id: 10, name: 'Some title', owner: 'ricardo' }
    ];

    $scope.createDrawing = function () {
      drawingResource.save({}).$promise.then(function (_drawing) {
        $location.path('/documents/drawing/' + _drawing._id);
      }).catch(function () {
        //unable to create document
      });


    };

  });
