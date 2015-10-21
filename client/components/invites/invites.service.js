'use strict';

angular.module('teamDrawApp').factory('inviteResource', function ($resource) {
  var _resource = $resource('/api/invites/:id/:additional', {},
    {
      invite: {method: 'POST'},
      group: {
        method: 'GET',
        params: {
          id: 'group',
          additional: '@additional'
        },
        isArray: true
      },
      layers: {
        method:'GET',
        params: {
          id: 'layers',
          additional:'@additional'
        },
        isArray:true
      },
      delete: {
        method:'DELETE',
        params: {
          id:'@id',
          additional:'@additional'
        }
      }
    }
  );

  return _resource;
});
