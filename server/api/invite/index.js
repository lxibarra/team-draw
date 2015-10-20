'use strict';

var express = require('express');
var controller = require('./invite.controller');
var auth = require('../../auth/auth.service');
var docOnwership = require('../../docs/privileges/ownershipValidation');

var router = express.Router();

//Remove unneeded routes

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/group/:id', auth.isAuthenticated(), docOnwership.ownershipValidation(), controller.invitations);
router.post('/', auth.isAuthenticated(), controller.maxInvitations, docOnwership.ownershipValidation(), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id/:drawing', auth.isAuthenticated(), controller.setDocument, docOnwership.ownershipValidation(), controller.destroy); //Only should be able to kick users

module.exports = router;
