'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InviteSchema = new Schema({
  participant: Schema.Types.ObjectId,
  drawing:Schema.Types.ObjectId,
  active: { type:Boolean, default:false },
  isOwner: { type: Boolean, default:false },
  LastSeen: { type:Date, default:null }
});

module.exports = mongoose.model('Invite', InviteSchema);
