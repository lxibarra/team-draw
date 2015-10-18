'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  userFrom: Schema.Types.ObjectId,
  userTo: Schema.Types.ObjectId,
  created: { type:Date, default:Date.now() },
  document: { type:Schema.Types.ObjectId, default:null },
  notificationType:{
      message: { type:String },
      code: { type:String }    
  },
  content: { type:String },
  active: { type: Boolean, default:true }
});

module.exports = mongoose.model('Notification', NotificationSchema);