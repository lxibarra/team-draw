'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var History = require('./history.model');
var mongoose = require('mongoose');

describe('GET /api/historys', function() {

  var _id;

  it('Should create a History record', function(done) {
    var _history = new History({
      userId: mongoose.Types.ObjectId(),
      document: mongoose.Types.ObjectId(),
      created: new Date(),
      active: true,
      data: { }
    });

    History.create(_history, function(err, record) {
        if(err) return done(err);
        should.exist(record);
        _id = record._id;
        done();
    });
  });

  it('_id should not be undefined', function(done) {
    should.exist(_id);
    done();
  });

  it('should respond with JSON array', function(done) {
    this.timeout(15000);
    request(app)
      .get('/api/historys/' + _id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
          done();
      });
      done();
  });
});
