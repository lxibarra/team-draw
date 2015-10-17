'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InviteSchema = new Schema({
  participant: Schema.Types.ObjectId,
  drawing:Schema.Types.ObjectId,
  created: { type:Date, default:Date.now() },
  active: { type:Boolean, default:false },
  isOwner: { type: Boolean, default:false },
  lastSeen: { type:Date, default:null },
  rejected: { type:Boolean, default:false }
  //, userInformation: [ { type:Schema.Types.ObjectId, ref:'User' }]
});

module.exports = mongoose.model('Invite', InviteSchema);
