'use strict';

angular.module('teamDrawApp').factory('historyResource', function ($resource) {
  return $resource('/api/historys/:id/:controller', {
      id: '@id'
    },
    {
      layers: {
        method: 'GET',
        params: {
          id: '@id'
        },
        isArray: true
      },
      undo: {
        method: 'POST',
        params: {
          id: 'document',
          controller: 'undo'
        }
      }
    }
  );
});
