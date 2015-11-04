'use strict';

describe('Directive: slate', function () {

  // load the directive's module
  beforeEach(module('teamDrawApp'));
  beforeEach(module('socketMock'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, socket) {
    scope = $rootScope.$new();
    scope.socket = socket.socket;
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<slate></slate>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('');
  }));
});
