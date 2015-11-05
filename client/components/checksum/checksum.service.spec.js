'use strict';

describe('Checksum service', function () {

  beforeEach(module('teamDrawApp'));

  var checksum,
    testString = 'This is a random value to be checked',
    computedHash;

  beforeEach(inject(function (_checkSum_) {
    checksum = _checkSum_;
  }));

  it('create checksum', function () {
    computedHash = checksum.getHash(testString);
    expect(angular.isNumber(computedHash)).toBe(true);
  });

  it('Ensure checksum is correct', function(){
    //added a ! to make the string a little different
    var result = checksum.getHash('This is a random value to be checked!');
    expect(result).not.toBe(computedHash);
  });

  it('Ensure checksums are consistent', function() {
    var result = checksum.getHash('This is a random value to be checked');
    expect(result).toBe(computedHash);
  });



});
