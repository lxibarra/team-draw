angular.module('teamDrawApp').controller('toolbarCtrl', function($scope, $mdSidenav, $_color) {
    var originatorEv;

    $scope.colorSelected = {
      color:'#ffffff'
    };

    $scope.sideBar = function() {
        $mdSidenav('rightSidebar').toggle();
    };

    $scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    $scope.selectColor = function() {
      //open a color picker
      $('#color3').tinycolorpicker();
    };

    $scope.$watch('colorSelected', function(newValue) {
      //gets the color
      console.log(newValue);
      $_color = newValue;
    }, true);



});
