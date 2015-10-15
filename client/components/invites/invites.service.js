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
      }
    }
  );

  return _resource;
});
