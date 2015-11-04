'use strict';

angular.module('teamDrawApp')
  .service('imageHistory', function (maxHistory, socket, historyResource) {
    var actions = [], cursor = -1, tmp = [];

    function storeUndo(action) {
      historyResource.undo(action);
    }

    return {
      add:function(payLoad) {
        tmp = [];
        if(actions.length < maxHistory) {
          actions.push(payLoad);
        } else {
          actions.push(payLoad);
          actions.shift();
        }
      },
      undo:function() {
        console.log(actions);
        var action = actions.pop();
        storeUndo(action);
        tmp.push(action);

        return actions[actions.length-1];
      },
      redo:function() {
        return tmp.shift();
      }
    }
  });
