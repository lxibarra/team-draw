'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HistorySchema = new Schema({
  userId: { type:Schema.Types.ObjectId, ref:'User' },
  document: { type:Schema.Types.ObjectId, ref:'User' },
  created: { type:Date, default:Date.now() },
  active: { type:Boolean, default:true },
  data: { }
});

module.exports = mongoose.model('History', HistorySchema);
