'use strict';

var express = require('express');
var controller = require('./drawings.controller');

var auth = require('../../auth/auth.service');
var docAccess = require('../../docs/privileges/ownershipValidation');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', auth.isAuthenticated(), docAccess.ownershipValidation(), controller.fetch); //change controller method
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), docAccess.ownershipValidation(), controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
