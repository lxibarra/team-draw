angular.module('teamDrawApp').controller('toolbarCtrl', function($scope, $mdSidenav) {

    $scope.sideBar = function() {
        $mdSidenav('right').toggle();
    }
});