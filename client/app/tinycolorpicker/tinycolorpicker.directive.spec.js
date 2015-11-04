'use strict';

describe('Directive: tinycolorpicker', function () {

  // load the directive's module
  beforeEach(module('teamDrawApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('color picker created successfully', inject(function ($compile) {
    element = angular.element('<div tinycolorpicker></div>');
    element = $compile(element)(scope);
    expect(angular.element(element['0']).html()).toMatch(/canvas/);
  }));
});
