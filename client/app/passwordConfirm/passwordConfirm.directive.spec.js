'use strict';

describe('Directive: passwordConfirm', function () {

  // load the directive's module
  beforeEach(module('teamDrawApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<password-confirm></password-confirm>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('');
  }));
});
