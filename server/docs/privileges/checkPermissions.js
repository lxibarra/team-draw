var user_documents = require('../../api/drawings/drawing.participants.model');

var canAccess = function (user, document) {
  var policy = {};
  if (document.owner === user.id) {
    policy.hasAccess = true;
    policy.isOwner = true;
    policy.canRead = true;
    policy.canWrite = true;
  } else {
    user_documents.find({drawing: document._id}).where('participant').equals(user.id).exec(function(err, portfolios) {
      //use this as middleware
    });
  }
};
