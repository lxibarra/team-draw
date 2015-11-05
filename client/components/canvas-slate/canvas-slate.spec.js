describe('Controller: CanvasSlateCtrl', function () {

  beforeEach(module('teamDrawApp'));
  beforeEach(module('socketMock'));

  var CanvasSlateCtrl, scope, $httpBackend;

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    CanvasSlateCtrl = $controller('CanvasSlateCtrl', {
      $scope:scope
    });
  }));

  it('Do something', function() {
      expect(1).toBe(1);
  });

});
