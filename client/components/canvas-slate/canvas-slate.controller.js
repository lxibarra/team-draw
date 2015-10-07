'use strict';
angular.module('teamDrawApp').controller('CanvasSlateCtrl', function($scope) {

    $scope.layers = [
      {
        id:1,
        name:'Ricardo',
        color:'#cccccc'
      },
      {
        id:2,
        name:'Nashelly',
        color:'pink'
      },
      {
        id:3,
        name:'Leonardo',
        color:'yellow'
      }
    ];


    $scope.clicked = function() {
        console.log('Yeap i was clicked');
    };
  //have to receive toolbar changes
  //$scope.setUpTool

    $scope.$on('toolBar/setUpTool', function(event, setUpTool) {
      $scope.setUpTool = setUpTool;
    });

    angular.element('#drawing').on('click', function() {
      console.log('Concentrate');
    });

});
