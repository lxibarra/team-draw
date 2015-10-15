'use strict';

var express = require('express');
var controller = require('./invite.controller');
var auth = require('../../auth/auth.service');
var docOnwership = require('../../docs/privileges/ownershipValidation');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/group/:id', auth.isAuthenticated(), docOnwership.ownershipValidation(), controller.invitations);
router.post('/', auth.isAuthenticated(), docOnwership.ownershipValidation(), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
