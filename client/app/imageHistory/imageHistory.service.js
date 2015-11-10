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
        console.log(actions);
      },
      undo: function () {
        //tmp.push(actions.pop());
        var poped = actions.pop();
        tmp.push(poped);
        return actions[actions.length - 1]||poped;
      },
      redo: function () {
       // var poped = tmp.pop();
       // actions.push(poped);
       // return poped;
      }
    }
  });
