'use strict';

angular.module('teamDrawApp')
  .service('imageHistory', function (maxHistory, socket, historyResource) {
    var actions = [], cursor = -1, tmp = [];

    function storeUndo(action) {
      if (action) {
        //historyResource.undo(action);
      }
    }

    return {
      add: function (payLoad) {
        tmp = [];
        if (actions.length < maxHistory) {
          actions.push(payLoad);
        } else {
          actions.push(payLoad);
          actions.shift();
        }
      },
      undo: function () {
        console.log(actions);
        actions.pop();
        console.log(actions);
        return actions[actions.length-1];
        /*if (actions.length > 0) {
          actions.pop();
          var action = actions.pop();
          actions.pop();
          //storeUndo(action);
          tmp.push(action);
          return action;
        } else {
          return undefined;
        }*/
      },
      redo: function () {
        return tmp.shift();
      }
    }
  });
