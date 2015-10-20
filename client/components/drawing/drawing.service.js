'use strict';

angular.module('teamDrawApp').factory('drawingResource', function($resource) {
  var _resource = $resource('/api/drawingss/:drawingId/:additional',
    { drawingId:'@id' },
    { put: { method:'PUT'},
      collection:{
        method:'GET',
        params:{
          drawingId:'collection',
          additional:'@page'
        },
        isArray:true
      }
    }
  );
  //addtional configuration may go here
  return _resource;
});
