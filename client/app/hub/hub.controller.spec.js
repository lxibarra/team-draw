'use strict';

describe('Controller: HubCtrl', function () {

  // load the controller's module
  beforeEach(module('teamDrawApp'));

  var HubCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HubCtrl = $controller('HubCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
