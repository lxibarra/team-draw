'use strict';

var _ = require('lodash');
var Invite = require('./invite.model');
var User = require('../user/user.model');

// Get list of invites
exports.index = function(req, res) {
  Invite.find(function (err, invites) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(invites);
  });
};

// Get a single invite
exports.show = function(req, res) {
  Invite.findById(req.params.id, function (err, invite) {
    if(err) { return handleError(res, err); }
    if(!invite) { return res.status(404).send('Not Found'); }
    return res.json(invite);
  });
};

exports.invitations = function(req, res) {
   //check this method is not retunrnign anything
    Invite.find({ drawing:req.params.id })
      .where('participant')
      .ne(req.user.id)
      .exec(function(err, invites) {
        if(err) { return handleError(res, err); }
        if(invites) {
          var userList = [];
          invites.forEach(function(invite) {
            User.findById(invite.participant, function (err, user) {
              if (err) {
                return handleError(res, err);
              }
              userList.push(_.assign({participantName: user.name || 'Unavailable'}, invite._doc));
            });
          });

          res.status(200).json(userList);

        } else {
          return res.status(200).json([]);
        }
    });
};

// Creates a new invite in the DB.
//Requires authentication and policy middleware
exports.create = function(req, res) {
  if(req.body.active) { delete req.body.active; }
  if(req.body.isOwner) { delete req.body.isOwner; }
  if(req.body.LastSeen) { delete req.body.LastSeen; }

  Invite.findOne({ participant:req.body.participant, drawing:req.body.drawing }, function(err, exists) {
    if(err) { return handleError(res, err); }
    if(!exists) {
      Invite.create(req.body, function (err, invite) {
        if (err) {
          return handleError(res, err);
        }
        User.findById(invite.participant, function (err, user) {
          if (err) {
            return handleError(res, err);
          }
          return res.status(201).json(_.assign({participantName: user.name || 'Unavailable'}, invite._doc));
        });
      });
    } else {
        return res.status(304).send('Invitation already sent');
    }
  });

};

// Updates an existing invite in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Invite.findById(req.params.id, function (err, invite) {
    if (err) { return handleError(res, err); }
    if(!invite) { return res.status(404).send('Not Found'); }
    var updated = _.merge(invite, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(invite);
    });
  });
};

// Deletes a invite from the DB.
exports.destroy = function(req, res) {
  Invite.findById(req.params.id, function (err, invite) {
    if(err) { return handleError(res, err); }
    if(!invite) { return res.status(404).send('Not Found'); }
    invite.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
