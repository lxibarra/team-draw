'use strict';

var _ = require('lodash');
var Drawings = require('./drawings.model');

// Get list of drawingss
exports.index = function(req, res) {
  Drawings.find(function (err, drawingss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(drawingss);
  });
};

// Get a single drawings
exports.show = function(req, res) {
  Drawings.findById(req.params.id, function (err, drawings) {
    if(err) { return handleError(res, err); }
    if(!drawings) { return res.status(404).send('Not Found'); }
    return res.json(drawings);
  });
};

// Creates a new drawings in the DB.
exports.create = function(req, res) {
  var doc = req.body||{};
  doc.name = doc.name||'Untitled';
  doc.info = doc.info||'';
  doc.active = true;
  doc.owner = req.user._id;

  Drawings.create(doc, function(err, drawings) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(drawings);
  });

};

// Updates an existing drawings in the DB.
exports.update = function(req, res) {
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
};

// Deletes a drawings from the DB.
exports.destroy = function(req, res) {
  Drawings.findById(req.params.id, function (err, drawings) {
    if(err) { return handleError(res, err); }
    if(!drawings) { return res.status(404).send('Not Found'); }
    drawings.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
