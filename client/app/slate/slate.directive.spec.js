'use strict';

describe('Directive: slate', function () {

  // load the directive's module
  beforeEach(module('teamDrawApp'));
  beforeEach(module('socketMock'));

  var element,
    scope,
    directiveScope, compiledEl;

  beforeEach(inject(function ($rootScope, socket, $compile) {
    scope = $rootScope.$new();
    scope.socket = socket.socket;
    element = angular.element('<div slate width="680" height="480" data-layers="layers" data-document="document" data-socket="socket" data-user-id="userId"></div>');
    compiledEl = $compile(element)(scope);
    directiveScope = element.isolateScope();
    directiveScope.layers = [{participant: {_id: 'cnv1'}}, {participant: {_id: 'cnv2'}}, {participant: {_id: 'cnv3'}}];


    scope.$digest();

  }));

  it('should make hidden element visible', inject(function ($compile) {
    var elem = angular.element('<slate ></slate>');
    elem = $compile(elem)(scope);
    expect(elem.text()).toBe('');

  }));

  it('default components created', function () {
    //remember preview layer is autocreated
    expect(angular.element(element[0]).children().length).toBe(2);
  });


});
