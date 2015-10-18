angular.module('teamDrawApp').value('searchSecondsWait', 1000)
  .controller('ParticipantListCtrl',
  function ($scope, User, searchSecondsWait, $routeParams, inviteResource, $mdToast, $mdDialog, socket, Auth) {

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

    $scope.selectedItemChange = function (item) {
      if (item) {
        var request = {
          participant: item._id,
          drawing: $routeParams.id,
          created:new Date()
        };
         
        inviteResource.save(request).$promise.then(function(data){
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
            active:true
          });
          /*
          socket.socket.emit('invite', {
              user:data.participant,
              document:data.drawing,
              userName:user.name,
              userId:user._id,
              date:data.created,
              notificationType:{ 
                message:'New Invitation',
                type:'invite'
              }  
          });
          */
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

        item.$remove({id:item._id, additional:$routeParams.id }).then(function() {
          var index = $scope.group.indexOf(item);
          if(index !== -1) {
            $scope.group.splice(index, 1);
          }
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


