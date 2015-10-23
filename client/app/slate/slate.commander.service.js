'use strict';

/**
 * Command patter for talking to the drawing services.
 *
 * Main advantage is that we can provide action mappers for our services without polluting the actual service with
 * mouse events.
 *
 * For each Drawing service we add a mappedActions object wich basically has a property with the name of the service
 * method and at the same time, we provide with an array the events on which we want to call the native service methods.
 *
 * The array of events can be defined as anything else, just make sure you set the same values when executing
 * the command e.g slateCmd.exec('ServiceName', ['event1', 'event2', ..], ['arguments', 'as', 'array']
 */

angular.module('slatePainting').service('slateCmd',
  function(
    Circle,
    Pencil,
    Eraser
  ){

    var _service = {};
    _service.Circle = Circle;
    _service.Pencil = Pencil;
    _service.Eraser = Eraser;


    _service.Pencil.mappedActions = {
      setUp: [],
      draw: ['mousemove', 'mousedown'],
      startDraw:['mousedown'],
      preview: ['mousemove'],
      quickDraw:['remote mousemove', 'remote mousedown'],
      startQuickDraw:['remote mousedown']
    };

    _service.Eraser.mappedActions = {
      setUp:[],
      clear:['mousemove', 'mousedown'],
      draw: ['mousedown'],
      preview:['mousemove'],
      quickClear:['remote mousemove', 'remote mousedown'],
      quickDraw:['remote mousedown']
    };

    _service.Circle.mappedActions = {
        setUp:[],
        draw:['mouseup'],
        preview:['mousemove', 'mousedown'],
        startDraw:['mousedown'],

        quickDraw:['remote mouseup'],
        //quickPreview:['remote mousemove', 'remote mousedown'],
        startQuickDraw:['remote mousedown']

    };

    function getMethod(service, events) {
      var methods = [];
      Object.keys(_service[service].mappedActions).forEach(function(prop) {
          if(angular.equals(_service[service].mappedActions[prop], events)) {
            methods.push(prop);
          }
      });
      return methods;
    }

    return {
      setProperty:function() {
        //for settign and getting properties
        //get object reference and use call to pass in params
      },
      exec:function(service, events, args) {
        if(service) {
          var executionList = getMethod(service, events);
          executionList.forEach(function (m) {
            _service[service][m].apply(_service[service], args)
          });
        } else {
          console.info('No service has been provided');
        }
      }
    }
});
