'use strict';

describe('Controller: MaterialsCtrl', function () {

  // load the controller's module
  beforeEach(module('teamDrawApp'));
  beforeEach(module('socketMock'));

  var MaterialsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialsCtrl = $controller('MaterialsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
