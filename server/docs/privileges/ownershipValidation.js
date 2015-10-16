var Drawings = require('../../api/drawings/drawings.model');
var user_documents = require('../../api/invite/invite.model');
var compose = require('composable-middleware');

function getPolicy (user, document, callback) {
  var policy = {};
  policy.owner = document.owner;
  policy.document = document.id;
  policy.isPrivate = document.isPrivate;

  if (document.owner == user.id) {
    policy.isValid = true;
    policy.hasAccess = true;
    policy.isOwner = true;
    policy.canRead = true;
    policy.canWrite = true;
    callback(policy);
  } else {
     user_documents.findOne({drawing: document._id}).where('participant').equals(user.id).exec(function(err, shared) {
      if(err) {
        return { isValid:false };
      }
      policy.isValid = true;
      if(shared) { //user was invited
        policy.hasAccess = true;
        policy.isOwner = shared.isOwner;
        policy.canRead = true;
        policy.canWrite = true;
      } else  {
        policy.hasAccess = !document.isPrivate;
        policy.isOwner = false;
        policy.canRead = !document.isPrivate;
        policy.canWrite = false;
      }

      callback(policy);
    });
  }
}

//Authentication middleware must be called before using this functions
function getDocPrivileges() {
  return compose()
    //attach document to request
    .use(function(req, res, next) {

            //var documentId = req.params.id||req.body.documentId||req.body.drawing;
            var documentId = req.body.documentId||req.body.drawing||req.params.id;

            Drawings.findById(documentId, function(err, document) {
            if(err) return next(err);
            if(!document) return res.status(404).send('Unable to find document');
            req.document = document;
            next();
        });
    })
    //Attach document policy
    .use(function(req, res, next) {
         getPolicy(req.user, req.document, function(policy) {
           if(!policy.isValid) { return res.status(500).send('Unable to verify access level'); }
           if(!policy.hasAccess) { return res.status(403).send('Forbidden'); }
           req.policy = policy;
           next();
         });
    });
}


exports.ownershipValidation = getDocPrivileges;
