angular.module('teamDrawApp').controller('toolbarCtrl', function($scope, $mdSidenav) {
    var originatorEv;
    $scope.sideBar = function() {
        $mdSidenav('rightSidebar').toggle();
    };

    $scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };
});