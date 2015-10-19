'user strict';

angular.module('teamDrawApp').factory('notificationResource', function ($resource) {
  return $resource('/api/notifications/:id/:controller', {
      id: '@id'
    },
    {
      latest: {
        method:'GET',
        params:{
          id:'latest'
        },
        isArray:true
      }
    }
  )
});
