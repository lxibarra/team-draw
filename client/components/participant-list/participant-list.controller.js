angular.module('teamDrawApp').value('searchSecondsWait', 2000)
  .controller('ParticipantListCtrl',
  function ($scope, User, searchSecondsWait) {

    var searchTm;

    $scope.selectedItem = '';
    $scope.searchText = '';

    $scope.searchTextChange = function (term) {
       //i could have some logic here if needed;
    };

    $scope.searchTextChange = function (value) {
      //i could have some logic here if needed;
    };

    $scope.selectedItemChange = function(item) {
      $scope.searchText = '';
    };

    $scope.querySearch = function(term) {
      if(searchTm){
        clearTimeout(searchTm);
      }

      return new Promise(function(resolve){
        searchTm = setTimeout(function() {
           resolve(User.query({controller: term}).$promise)
        }, searchSecondsWait);
      });
    };

  });


