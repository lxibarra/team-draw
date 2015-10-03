'use strict';
/**
 * Requires jquery tinycolorpicker that can be found here https://github.com/wieringen/tinycolorpicker
 */
angular.module('teamDrawApp')
  .directive('tinycolorpicker', function () {
    return {
      restrict: 'A',
      scope:{
        colorSelected:'=colorSelected'
      },
      template:'<a class="color">' +
                  '<div class="colorInner" ng-transclude></div>' +
               '</a>' +
               '<div class="track"></div>' +
               '<input ng-model="color" type="hidden" class="colorInput"/>',
      transclude:true,
      link: function (scope, element, attrs) {
        $(element).tinycolorpicker();

        scope.$watch(function() {
          return $('input', element).val();
        }, function(newValue, oldValue) {
          //you can set an object on a parent element to listen for changes on colorSelected.color
          scope.colorSelected.color = newValue;
        });
      }
    };
  });
