'use strict';

angular.module('teamDrawApp')
  .service('imageHistory', function (maxHistory, socket, historyResource) {
    var actions = [], cursor = -1, tmp = [];

    function storeUndo(action) {
      if (action) {
        //historyResource.undo(action);
        //must permanently make changes
      }
    }

    return {
      add: function (payLoad) {
        tmp = [];
        actions.push(payLoad);
        if (actions.length >= maxHistory) {
          actions.shift();
        }
      },
      undo: function () {
        //tmp.push(actions.pop());
        actions.pop();
        return actions[actions.length - 1];
      },
      redo: function () {
        return tmp.shift();
      }
    }
  });
