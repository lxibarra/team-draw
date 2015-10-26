'use strict';

angular.module('teamDrawApp').service('checkSum', function () {

  //should implement memoization for the last 40 or 50 values only to avoid re calculation

  function createHash(value) {
    var hash = 0, i, chr, len;
    if (value.length == 0) return hash;
    for (i = 0, len = value.length; i < len; i++) {
      chr = value.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  return {

    getHash: createHash,

    areEqual: {
      fromString: function (value1, value2) {
        try {
          var hash1 = createHash(value1);
          var hash2 = createHash(value2);
          console.log(hash1, '===', hash2, '=', hash1 == hash2);
          return hash1 == hash2;
        } catch(ex) {
          return false;
        }
      }
    }
  }
});
