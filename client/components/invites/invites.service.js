'use strict';

angular.module('teamDrawApp').factory('Invite', function($resource){
    return $resource('/api/invites/:id',
      { id:'@id' }
    );
});
