angular.module('teamDrawApp').value('searchSecondsWait', 1000)
  .controller('ParticipantListCtrl',
  function ($scope, User, searchSecondsWait, $routeParams, inviteResource) {

    var searchTm;

    $scope.selectedItem = '';
    $scope.searchText = '';

    $scope.group = [];

    console.log(inviteResource);

    inviteResource.group({ additional:$routeParams.id }).$promise.then(function(data) {
      console.log(data);
    }).catch(function(err) {
      console.log(err);
    });


    $scope.searchTextChange = function (term) {
      //i could have some logic here if needed;
    };

    $scope.searchTextChange = function (value) {
      //i could have some logic here if needed;
    };

    $scope.selectedItemChange = function (item) {
      //Have to test the service
      //this is where i left of
      if (item) {
        console.log(item);
        var request = {
          participant: item._id,
          drawing: $routeParams.id
        };

        inviteResource.save(request).$promise.then(function(data){
          console.log('Post done: ', data);
          $scope.searchText = '';
        }).catch(function(response) {
            console.log(response);
            if(response.status === 304) {

            }
        });
        /*Invite.save(request).$promise(function (data) {
          console.log(data);
          $scope.searchText = '';
        });*/

      }
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


