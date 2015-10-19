'use strict';

angular.module('teamDrawApp').factory('drawingResource', function($resource) {
  var _resource = $resource('/api/drawingss/:drawingId',
    { drawingId:'@id' },
    { put: { method:'PUT'} }
  );
  //addtional configuration may go here
  return _resource;
});
