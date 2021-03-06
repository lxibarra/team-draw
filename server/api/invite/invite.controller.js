'use strict';

var _ = require('lodash');
var Invite = require('./invite.model');
var User = require('../user/user.model');

// Get list of invites
exports.index = function (req, res) {
  Invite.find(function (err, invites) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(invites);
  });
};

exports.setDocument = function (req, res, next) {
  req.body.drawing = req.params.drawing;
  next();

};

// Get a single invite
exports.show = function (req, res) {
  Invite.findById(req.params.id, function (err, invite) {
    if (err) {
      return handleError(res, err);
    }
    if (!invite) {
      return res.status(404).send('Not Found');
    }
    return res.json(invite);
  });
};

exports.maxInvitations = function (req, res, next) {
  Invite.find({drawing: req.params.id || req.body.drawing}, function (err, invitations) {
    if (err) {
      return handleError(res, err);
    }
    if (invitations.length < 4) {
      req.body.invitations = invitations;
      next();
    } else {
      return res.status(302).send('User limit has been reached');
    }
  });
};

exports.userLayers = function (req, res) {
  Invite.find({drawing: req.params.id})
    .populate({path: 'participant', select: '_id name'})
    .populate('drawing').exec(function (err, layers) {
      if (err) {
        return handleError(res, err);
      }

      return res.status(200).json(layers);
    });
};

exports.sharedDocuments = function (req, res) {
  console.log('Reached server');
  Invite.find({participant: req.user.id})
    .populate('drawing')
    .limit(20) //hard coded until pagination is implemented
    .sort({ created:-1 })
    .exec(function (err, results) {
      if (err) {
        console.log(err);
        handleError(res, err)
      }

      var arr = [];

      if(results) {
          results.forEach(function(invite) {
              arr.push(invite.drawing);
          });
      }

      return res.status(200).json(arr);

    });
};

exports.invitations = function (req, res) {

  //should change this method to use populate but many implementations will break

  Invite.find({drawing: req.params.id})
    .where('participant')
    .ne(req.user.id)
    .populate({path: 'participant', select: '_id name'})
    .populate('drawing')
    .exec(function (err, layers) {
      if (err) {
        return handleError(res, err);
      }

      return res.status(200).json(layers);
    });

  /*var userList = [];
   Invite.find({drawing: req.params.id})
   .where('participant')
   .ne(req.user.id)
   .exec(function (err, invites) {

   if (err) {
   return handleError(res, err);
   }
   if (invites) {

   var pCollection = [];
   invites.forEach(function (invite) {

   var p1 = new Promise(function (resolve, reject) {
   User.findById(invite.participant, function (err, user) {
   if (err) {
   reject(err);
   }
   resolve(_.assign({participantName: user.name || 'Unavailable'}, invite._doc));
   });
   });

   pCollection.push(p1);
   });

   Promise.all(pCollection).then(function (values) {
   return res.status(200).json(values);
   });


   } else {
   return res.status(200).json([]);
   }
   });*/
};

// Creates a new invite in the DB.
//Requires authentication and policy middleware
exports.create = function (req, res) {

  if (!req.policy.isOwner) {
    return res.status(403).send('Only document owners can invite users');
  }

  if (req.body.active) {
    delete req.body.active;
  }
  if (req.body.isOwner) {
    delete req.body.isOwner;
  }
  if (req.body.LastSeen) {
    delete req.body.LastSeen;
  }


  if (req.body.invitations) { //We use the array instead of another search
    var arrInvites = req.body.invitations, exists = false;
    arrInvites.forEach(function (item) {
      if (item.participant == req.body.participant) {
        exists = true;
      }
    });

    if (exists) {
      return res.status(304).send('Invitation already sent');
    } else {
      Invite.create(req.body, function (err, invite) {
        if (err) {
          return handleError(res, err);
        }

        Invite.findOne({_id: invite._id})
          .populate({path: 'participant', select: '_id name'})
          .populate('drawing')
          .exec(function (err, user) {

            if (err) {
              return handleError(res, err);
            }

            return res.status(201).json(user);
            //return res.status(201).json(_.assign({participantName: user.name || 'Unavailable'}, invite._doc));
          });
      });
    }
  } else {
    //If no search has been made for invites we find them normally
    Invite.findOne({participant: req.body.participant, drawing: req.body.drawing}, function (err, exists) {
      if (err) {
        return handleError(res, err);
      }
      if (!exists) {
        Invite.create(req.body, function (err, invite) {
          if (err) {
            return handleError(res, err);
          }

          Invite.findOne({_id: invite._id})
            .populate({path: 'participant', select: '_id name'})
            .populate('drawing')
            .exec(function (err, user) {
              if (err) {
                return handleError(res, err);
              }
              return res.status(201).json(user);

              //  return res.status(201).json(_.assign({participantName: user.name || 'Unavailable'}, invite._doc));
            });
        });
      } else {
        return res.status(304).send('Invitation already sent');
      }
    });

  }
};

// Updates an existing invite in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Invite.findById(req.params.id, function (err, invite) {
    if (err) {
      return handleError(res, err);
    }
    if (!invite) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(invite, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(invite);
    });
  });
};

// Deletes a invite from the DB.
exports.destroy = function (req, res) {
  if (req.policy.isOwner) {
    Invite.findById(req.params.id).populate('participant', 'name').exec(function (err, invite) {
      if (err) {
        return handleError(res, err);
      }
      if (!invite) {
        return res.status(404).send('Not Found');
      }

      invite.remove(function (err) {
        if (err) {
          return handleError(res, err);
        }

        return res.status(200).json(invite);
      });
    });
  } else {
    return res.status(403).send('Forbidden Only document owners can kick users');
  }
};

function handleError(res, err) {
  return res.status(500).send(err);
}
