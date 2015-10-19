var Notifications = require('./notification.model');
var Users = require('../user/user.model');
var select = 'name'; //Fields to get from the user collection

//change implementation for populate
exports.create = function(notification, callback) {
  Notifications.create(notification, function(err, _n) {
    _n.populate('userFrom', { name:1 }).populate('userTo', {name:1}, function (err, list) {
      if (err) { console.log(err); }
      callback(list);
    });
  });
  /* //Manage repeated document invitations
  Notifications.findOne({ userFrom:notification.userFrom, userTo:notification.userTo, document:notification.document }, function(err, notification) {
      if(err) {  }
      if(notification) {
        notification.created = new Date();
        notification.save(function(err, notify) {
          notification.populate('userFrom', { name:1 }).populate('userTo', {name:1}, function (err, list) {
            if (err) { console.log(err); }
            callback(list);
          });
        });
      } else {
        Notifications.create(notification, function(err, _n) {
          _n.populate('userFrom', { name:1 }).populate('userTo', {name:1}, function (err, list) {
            if (err) { console.log(err); }
            callback(list);
          });
        });
      }
  });
  */
};


