'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);


var NotificationSchema = new Schema({
  userFrom: { type:Schema.Types.ObjectId, ref:'User' },
  userTo: { type:Schema.Types.ObjectId, ref:'User' },
  created: { type:Date, default:Date.now() },
  document: { type:Schema.Types.ObjectId, default:null },
  notificationType:{
      message: { type:String },
      code: { type:String }
  },
  content: { type:String, default:null },
  active: { type: Boolean, default:true }
});

NotificationSchema.plugin(deepPopulate);

module.exports = mongoose.model('Notification', NotificationSchema);
