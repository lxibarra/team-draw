describe("LZW Compression service", function() {
  beforeEach(module('teamDrawApp'));

  var lzw, compressed, testString = 'This is a string';


  beforeEach(inject(function(_lzw_) {
      lzw = _lzw_;
  }));


  it('compress string value', function() {
    compressed = lzw.zip(testString);
    expect(angular.isArray(compressed)).toBe(true);
  });

  it('Uncompress data', function() {
    var result = lzw.unzip(compressed);
    expect(result).toBe(testString);
  });

});
