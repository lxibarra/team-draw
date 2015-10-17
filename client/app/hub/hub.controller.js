'use strict';

angular.module('teamDrawApp')
  .controller('HubCtrl', function ($scope, drawingResource, $location, Auth, socket) {

    //socket.socket.join(Auth.getCurrentUser()._id );

    if(Auth.isLoggedIn()) {
      //console.log('Emited event:', socket);
      //socket.socket.connect();
      socket.socket.emit('userLogin', { _id: Auth.getCurrentUser()._id });
      console.log(socket.socket);
    }

    socket.socket.on('message', function(message) {
        console.log(message);
    });

    //demo data
    $scope.documentList = [
      { _id:1, name:'Mountain high', owner:'ricardo' },
      { _id:2, name:'Over the clouds', owner:'ricardo' },
      { _id:3, name:'Home sweet home', owner:'ricardo' },
      { _id:4, name:'My favorite place', owner:'ricardo' },
      { _id:5, name:'Solana beach', owner:'ricardo' },
      { _id:6, name:'School gardens', owner:'ricardo' },
      { _id:7, name:'Statues', owner:'ricardo' },
      { _id:8, name:'Some doc', owner:'ricardo' },
      { _id:9, name:'Delete me', owner:'ricardo' },
      { _id:10, name:'Some title', owner:'ricardo' }
    ];

    $scope.createDrawing = function() {
       drawingResource.save({}).$promise.then(function(_drawing) {
           $location.path('/documents/drawing/' + _drawing._id);
        }).catch(function() {
          //unable to create document
        });


    };

  });
