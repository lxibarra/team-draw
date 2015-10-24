'use strict';

var express = require('express');
var controller = require('./history.controller');

var router = express.Router();

//Remove unused routes

router.get('/:id', controller.index);

/*
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
*/
module.exports = router;
