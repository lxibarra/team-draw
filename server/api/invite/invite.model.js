'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InviteSchema = new Schema({
  participant: { type:Schema.Types.ObjectId, ref:'User' },
  drawing: { type:Schema.Types.ObjectId, ref:'Drawings'},
  created: { type:Date, default:Date.now() },
  active: { type:Boolean, default:false },
  isOwner: { type: Boolean, default:false },
  lastSeen: { type:Date, default:null },
  rejected: { type:Boolean, default:false },
  order: { type:Number, default:0 },
  visible: { type:Boolean, default:true }
});

module.exports = mongoose.model('Invite', InviteSchema);
