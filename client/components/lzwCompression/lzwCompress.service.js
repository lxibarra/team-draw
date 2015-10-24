'use strict';

angular.module('teamDrawApp').service('lzw', function(){

   return {
      zip:function(data) {
        return window.lzwCompress.pack(data);
      },
      unzip:function(data) {
        return window.lzwCompress.unpack(data);
      }
   }
});
