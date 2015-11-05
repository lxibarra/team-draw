'use strict';

describe('Controller: MaterialsCtrl', function () {

  // load the controller's module
  beforeEach(module('teamDrawApp'));
  beforeEach(module('socketMock'));

  var MaterialsCtrl, scope, $HttpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $HttpBackend = _$httpBackend_;

    MaterialsCtrl = $controller('MaterialsCtrl', {
      $scope: scope
    });
  }));

  it('should get document properties', function () {
    $HttpBackend.expectGET('/api/drawingss').respond({ok:true});
    $HttpBackend.flush();
    expect(angular.isObject(scope.doc)).toBe(true);
  });
});
