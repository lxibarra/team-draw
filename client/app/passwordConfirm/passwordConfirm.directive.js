'use strict';

angular.module('teamDrawApp')
  .directive('passwordConfirm', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        otherModelValue: '=compareTo'
      },
      link: function (scope, element, attrs, ngModel) {
        ngModel.$validators.compareTo = function (modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
            ngModel.$validate();
        });

      }
    };
  });
