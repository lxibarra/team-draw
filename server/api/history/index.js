'use strict';

var express = require('express');
var controller = require('./history.controller');
var docOnwership = require('../../docs/privileges/ownershipValidation');
var auth = require('../../auth/auth.service');

var router = express.Router();

//Remove unused routes
router.post('/document/undo', auth.isAuthenticated(), docOnwership.ownershipValidation(), controller.undo);
router.get('/:id', controller.index);


/*
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
*/
module.exports = router;
