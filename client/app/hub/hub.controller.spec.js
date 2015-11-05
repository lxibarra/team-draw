'use strict';

describe('Controller: HubCtrl', function () {

  // load the controller's module
  beforeEach(module('teamDrawApp'));
  beforeEach(module('socketMock'));

  var HubCtrl, scope, $httpBackend;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/drawingss/collection/1')
      .respond(['draw1', 'draw2']);
    scope = $rootScope.$new();
    HubCtrl = $controller('HubCtrl', {
      $scope: scope
    });
  }));

  it('ensure drawings are being fetched from server', function () {
    $httpBackend.flush();
    expect(scope.documentList.length).toEqual(2);
  });


  it('get shared documents', function() {
    $httpBackend.expectGET('/api/invites/shared').respond(['invite1']);
    scope.getShared(1);
    $httpBackend.flush();
    expect(scope.documentList.length).toEqual(1);

  });

});
