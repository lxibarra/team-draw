'use strict';

var _ = require('lodash');
var Drawings = require('./drawings.model');
var Invites = require('../invite/invite.model');
//remove this after successful refactorization
//var DrawingParticipants = require('./drawing.participants.model');

// Get list of drawingss
exports.index = function (req, res) {
  Drawings.find(function (err, drawingss) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(drawingss);
  });
};

//Request must be verified by ownershipValidation middleware
exports.fetch = function (req, res) {
  var response = {
    _id: req.document._id,
    policy: req.policy,
    document: req.document
  };

  return res.json(response);

};

// Get a single drawings
exports.show = function (req, res) {
  Drawings.findById(req.params.id, function (err, drawings) {
    if (err) {
      return handleError(res, err);
    }
    if (!drawings) {
      return res.status(404).send('Not Found');
    }
    return res.json(drawings);
  });
};

exports.list = function(req, res) {
  console.log('Fetched from collection controller');
  Drawings.find({ owner:req.user.id }, function(err, docs) {
      if(err) { return  handleError(req, res); }
      return res.status(200).json(docs);
  });
};

// Creates a new drawings in the DB.
exports.create = function (req, res) {
  var doc = req.body || {};
  doc.name = doc.name || 'Untitled';
  doc.info = doc.info || '';
  doc.active = true;
  doc.isPrivate = false;
  doc.owner = req.user._id;


  Drawings.create(doc, function (err, drawings) {
    if (err) {
      return handleError(res, err);
    }

    var DummySelfInvite = {
      participant: doc.owner,
      drawing: drawings._id,
      active: true,
      isOwner: true,
      LastSeen: new Date(),
      isPrivate: drawings.isPrivate
    };

    Invites.create(DummySelfInvite, function (err, shared) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(201).json(drawings);
    });

    //Old Working code
    /*
    var participantList = {
      participant: doc.owner,
      drawing: drawings._id,
      active: true,
      isOwner: true,
      LastSeen: new Date(),
      isPrivate: drawings.isPrivate
    };

    DrawingParticipants.create(participantList, function (err, shared) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(201).json(drawings);
    });
    */
  });

};

// Updates an existing drawings in the DB.
exports.update = function (req, res) {
  if (req.policy.canWrite) {

    if(req.body.document._id) { delete req.body.document._id; }
    var updated = _.merge(req.document, req.body.document);

    //We have to make extra sure that only the owner can change the
    //document ownership if necessary
    if(req.policy.isOwner) {
      updated.owner = req.body.document.owner;
    } else {
      updated.owner = req.policy.owner;
    }

    updated.save(function (err) {
      if (err) {
        return handleError(res, err)
      }

      var response = {
        _id: req.document._id,
        policy: req.policy,
        document: req.document
      };

      return res.status(200).json(response);
    });
  } else {
    return res.status(403).send('Forbidden');
  }

  //Original methods
  /*
   if(req.body._id) { delete req.body._id; }
   Drawings.findById(req.params.id, function (err, drawings) {
   if (err) { return handleError(res, err); }
   if(!drawings) { return res.status(404).send('Not Found'); }
   var updated = _.merge(drawings, req.body);
   updated.save(function (err) {
   if (err) { return handleError(res, err); }
   return res.status(200).json(drawings);
   });
   });
   */
};

// Deletes a drawings from the DB.
exports.destroy = function (req, res) {
  Drawings.findById(req.params.id, function (err, drawings) {
    if (err) {
      return handleError(res, err);
    }
    if (!drawings) {
      return res.status(404).send('Not Found');
    }
    drawings.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
