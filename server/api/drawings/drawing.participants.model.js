'use strict';

//deletion after successful refactor

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DrawingParticipants = new Schema({
  participant: Schema.Types.ObjectId,
  drawingId:Schema.Types.ObjectId,
  active:Boolean,
  isOwner:Boolean,
  LastSeen:Date
});

module.exports = mongoose.model('DrawingParticipants', DrawingParticipants);
