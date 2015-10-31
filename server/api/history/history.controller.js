'use strict';

var _ = require('lodash');
var History = require('./history.model');

// Get list of historys
exports.index = function(req, res) {
  //History.find({ document:req.params.id }).distinct('userId').exec(function (err, history) {

  History.distinct('userId', { document:req.params.id }, function(err, history) {
    if(err) { return handleError(res, err); }
      //console.log(history);
    if(history.length > 0) {
      var promises = [];
      history.forEach(function(userId) {
          promises.push(
            new Promise(function(resolve, reject){
              History.find({ document:req.params.id, userId:userId }).sort({ created:-1 }).limit(1).exec(function(err, result) {
                  if(err) {
                    reject(err);
                  } else {
                    resolve(result);
                  }
              });
            })
          );
      });

      Promise.all(promises).then(function(data) {
        return res.status(200).json(data);
      }).catch(function(err){
        handleError(res, err);
      });
    }


  });
};

exports.undo = function(req, res) {
  req.body.data.created = new Date();
  History.create(req.body, function(err, drawstate) {
    if(err) {
      handleError(err, res);
    }

    //communicate the undo with the socket
    console.log(req.body.document)
    History.socket.to(req.body.document).emit('remote:undo', req.body);


    return res.status(200).json(drawstate);

  });
};

/*
// Get a single history
exports.show = function(req, res) {
  History.find({ document:req.params.id }).distinct('userId').exec(function (err, history) {
    if(err) { return handleError(res, err); }
    if(!history) { return res.status(404).send('Not Found'); }
    return res.json(history);
  });
};

// Creates a new history in the DB.
exports.create = function(req, res) {
  History.create(req.body, function(err, history) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(history);
  });
};

// Updates an existing history in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  History.findById(req.params.id, function (err, history) {
    if (err) { return handleError(res, err); }
    if(!history) { return res.status(404).send('Not Found'); }
    var updated = _.merge(history, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(history);
    });
  });
};

// Deletes a history from the DB.
exports.destroy = function(req, res) {
  History.findById(req.params.id, function (err, history) {
    if(err) { return handleError(res, err); }
    if(!history) { return res.status(404).send('Not Found'); }
    history.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};
*/
function handleError(res, err) {
  return res.status(500).send(err);
}
