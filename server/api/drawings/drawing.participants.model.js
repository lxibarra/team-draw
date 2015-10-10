'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DrawingParticipants = new Schema({
  participant: Schema.Types.ObjectId,
  drawing:Schema.Types.ObjectId,
  active:Boolean,
  LastSeen:Date
});


module.exports = mongoose.model('DrawingParticipants', Schema.Types.ObjectId);
