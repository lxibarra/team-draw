/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var Users = require('../../server/api/user/user.model');
var Notifications = require('../../server/api/notification/notification.model');
var Notifications_wrapper = require('../../server/api/notification/notification.wrapper');
var History = require('../../server/api/history/history.model');


// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {

  /**
   * By Default
   * Each user gets its own Room with the database _id so its easy to find
   * (This way we dont need a reference to a socket)
   * */

  socket.join(socket.handshake.query.user);

  //send Message to specific user
  socket.on('message', function(data) {
    //We can check here if user is authorize to send message to user or group
    socket.to(data.user).emit('message', data.message)
  });

  socket.on('invite', function(data) {
   Notifications_wrapper.create(data, function(notification) {
      socket.to(data.userTo).emit('invite', notification);
      socket.to(data.document).emit('inviteSent', notification);
   });

  });

  socket.on('join', function(data) {
    //Token must be validated
    //check if user can join room
    //subscribe user to room
    //For testing reason any user can listen to changes on a canvas.

    //leave all other rooms before joining? ofcourse except users private room
    socket.join(data.document);
  });

  socket.on('draw', function(data) {
    //no need to check crendetials here because user already logged in.
      socket.to(data.document).emit('draw', data);
  });

  socket.on('change_drawing_history', function(data) {
      data.created = new Date();
      History.create(data, function(err, drawstate) {
          if(err) {
            socket.to(data.document).emit('save_point_error', 'save_point_error', {
              userId:data.userId,
              document:data.document,
              error:err
            });
          }
      });
  });

  socket.on('leave', function(data) {
    socket.leave(data.document);
  });

  //Need a listener to check if user is online. Maybe there is a socket.isOn()action








  //Each user creates its own room channel as follows
  //socket.join(socket.handshake.query.user); where socket.handshake.query.user = the users id in the database

  //Anytime communication to that user needs to happen, we send it ot its private room
  //socket.to(user._id).emit('message', {ok:'This is just for you'});

  //User may join as many rooms as needed e.g general notifications, personal channel, drawing, etc.

  //on the client just pass a message and indicate where do you intend to send the message
  //socket.emit('message', { user:id });

  //socket.on('message', function(serverData') {
  //   logic here
  // });







  //Register socket for the drawing
  // Insert sockets below
 // require('../api/history/history.socket').register(socket);
 // require('../api/history/history.controller').register(socket);
  require('../api/notification/notification.socket').register(socket);
  require('../api/invite/invite.controller').register(socket);
  require('../api/drawings/drawings.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:

  socketio.use(require('socketio-jwt').authorize({
     secret: config.secrets.session,
     handshake: true
  }));


  //just added
  /************************************
  socketio.on('connection', require('socketio-jwt').authorize({
    secret: config.secrets.session,
    timeout: 3000
  })).on('authenticated', function(socket) {
    console.log('I was authenticated');
    socket.address = socket.handshake.address !== null ?
    socket.handshake.address.address + ':' + socket.handshake.address.port :
      process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);

  });
  *///////////////////////////////////////////////////////
  //Original code

  socketio.on('connection', function (socket) {

    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });

};
