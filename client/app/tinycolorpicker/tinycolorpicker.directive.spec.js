'use strict';

describe('Directive: tinycolorpicker', function () {

  // load the directive's module
  beforeEach(module('teamDrawApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tinycolorpicker></tinycolorpicker>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tinycolorpicker directive');
  }));
});