angular.module('teamDrawApp').value('searchSecondsWait', 1000)
  .controller('ParticipantListCtrl',
  function ($scope, User, searchSecondsWait, $routeParams, inviteResource, $mdToast, $mdDialog, socket, Auth, $location) {

    var searchTm;
    var user = Auth.getCurrentUser();

    $scope.selectedItem = '';
    $scope.searchText = '';

    $scope.group = [];

    inviteResource.group({ additional:$routeParams.id }).$promise.then(function(data) {
      if(data.length > 0) {
        $scope.group = data.slice(0, data.length);
      }
    }).catch(function(err) {
      $mdToast.show(
        $mdToast.simple()
          .content('Unable to get user list')
          .position('left')
          .hideDelay(3000)
      );
    });

    $scope.statusDisplay = function (item) {
        if(item.rejected) {
          return 'user-status user-invited';
        }

        if(item.active) { //must also check if its online
          return 'user-status user-online';
        } else {
          return 'user-status user-offline';
        }
    };


    $scope.searchTextChange = function (term) {
      //i could have some logic here if needed;
    };

    $scope.searchTextChange = function (value) {
      //i could have some logic here if needed;
    };

    socket.socket.on('inviteSent', function(data) {
      console.log(user, data.userTo);
      if(user._id !== data.userFrom.id && user._id !== data.userTo._id) {
        $mdToast.show(
          $mdToast.simple()
            .content(data.userFrom.name + ' invited ' + data.userTo.name + ' to join.')
            .position('left')
            .hideDelay(3000)
        );

        $scope.group.push({
          participant:data.userTo._id,
          participantName:data.userTo.name
        });
        //$scope.group.push(data.customPayload);
        //also push to slate directive layers and document active/inactive layers
      }
    });

    socket.socket.on('kickuser', function(data) {

        if(data.kicker !== user._id) {

          $mdToast.show(
            $mdToast.simple()
              .content('User ' + data.participant.name + ' has been kicked out.')
              .position('left')
              .hideDelay(3000)
          );
          var index = -1;
          $scope.group.forEach(function(item, i) {
            if(item.participant == data.participant._id) {
              index = i;
            }
          });
          if(index !== -1) {
            $scope.group.splice(index, 1);
          }
          if(user._id == data.participant._id) {
            $location.path('/hub');
          }
        }


    });

    $scope.selectedItemChange = function (item) {
      if (item) {
        var request = {
          participant: item._id,
          drawing: $routeParams.id,
          created:new Date()
        };

        inviteResource.save(request).$promise.then(function(data){
          console.log('From source:', data);
          $scope.group.push(data);
          //This object currently does not map object for
          //notifications
          socket.socket.emit('invite', {
            userFrom:user._id,
            userTo:data.participant,
            created:data.created,
            document:data.drawing,
            notificationType:{
              message:'New Invitation',
              code:'invite'
            },
            content:null,
            active:true,
            customPayload:data
          });
          $scope.searchText = '';
        }).catch(function(response) {

            if(response.status === 304) {
              $mdToast.show(
                $mdToast.simple()
                  .content('User is already on the list')
                  .position('right')
                  .hideDelay(3000)
              );
            } else if(response.status === 302) {
              $mdToast.show(
                $mdToast.simple()
                  .content('User limit has been reached.')
                  .position('right')
                  .hideDelay(3000)
              );
            }
        });
      }
    };

    $scope.kickUser = function(item) {
      var confirm = $mdDialog.confirm()
        .title('Remove ' + item.participantName + '?')
        .content('User layer will be removed also. Are you sure you want to continue?')
        .ariaLabel('User removal')
        .ok('Remove')
        .cancel('Forget it');
      $mdDialog.show(confirm).then(function() {

        item.$remove({id:item._id, additional:$routeParams.id }).then(function(response) {
          var index = $scope.group.indexOf(item);
          if(index !== -1) {
            $scope.group.splice(index, 1);
          }
          response.kicker = user._id;
          //For better security this emit should be started on the server
          socket.socket.emit('kickuser', response);

        }).catch(function(err){
          $mdToast.show(
            $mdToast.simple()
              .content('Unable to kick user')
              .position('right')
              .hideDelay(3000)
          );
        });
      }, function() {
          //cancel removal
      });
    };

    $scope.querySearch = function (term) {
      if (searchTm) {
        clearTimeout(searchTm);
      }

      return new Promise(function (resolve) {
        searchTm = setTimeout(function () {
          resolve(User.query({controller: term}).$promise)
        }, searchSecondsWait);
      });
    };

  });


