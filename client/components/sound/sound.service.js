'use strict';

angular.module('teamDrawApp').service('soundBlaster', function(newInvite) {
  return {
    newInvitation:function() {
      var audio = new Audio(newInvite);
      audio.play();
    }
  }
});
