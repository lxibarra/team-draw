/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var History = require('./history.model');

exports.register = function(socket) {
  History.socket = socket;
};
