'use strict';

angular.module('teamDrawApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      query: {
        method: 'GET',
        isArray:true,
        params:{
            id:'search'
        }
      }
	  });
  });
