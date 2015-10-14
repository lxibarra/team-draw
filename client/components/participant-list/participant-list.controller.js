angular.module('teamDrawApp').value('searchSecondsWait', 2000)
  .controller('ParticipantListCtrl',
  function ($scope, User, searchSecondsWait, $routeParams, Invite) {

    var searchTm;

    $scope.selectedItem = '';
    $scope.searchText = '';

    console.log($routeParams.id);


    $scope.searchTextChange = function (term) {
      //i could have some logic here if needed;
    };

    $scope.searchTextChange = function (value) {
      //i could have some logic here if needed;
    };

    $scope.selectedItemChange = function (item) {
      //Have to test the service
      // this is where i left of
      var request = {
        participant: item._id,
        drawingId: $routeParams.id
      };

      $scope.searchText = '';
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


