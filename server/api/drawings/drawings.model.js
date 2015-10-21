'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DrawingsSchema = new Schema({
  name: { type:String, default:'Untitled drawing' },
  info: String,
  owner:{ type:Schema.Types.ObjectId, ref:'User' },
  active: Boolean,
  isPrivate:Boolean,
  created:{ type:Date, default:Date.now }
});

module.exports = mongoose.model('Drawings', DrawingsSchema);
