'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DrawingsSchema = new Schema({
  name: String,
  info: String,
  owner:Schema.Types.ObjectId,
  active: Boolean,
  isPrivate:Boolean,
  created:{ type:Date, default:Date.now }
});

module.exports = mongoose.model('Drawings', DrawingsSchema);
