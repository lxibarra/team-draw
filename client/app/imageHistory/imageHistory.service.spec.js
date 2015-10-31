'use strict';

describe('Service: imageHistory', function () {

  // load the service's module
  beforeEach(module('teamDrawApp'));

  // instantiate service
  var imageHistory;
  beforeEach(inject(function (_imageHistory_) {
    imageHistory = _imageHistory_;
  }));

  it('should do something', function () {
    expect(!!imageHistory).toBe(true);
  });

});
