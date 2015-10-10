/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Drawings = require('./drawings.model');

exports.register = function(socket) {
  Drawings.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Drawings.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('drawings:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('drawings:remove', doc);
}