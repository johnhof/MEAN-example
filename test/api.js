var superTest = require('supertest');
var server    = require('../server');
var mocha     = require('mocha');
var expect    = require('chai').expect;
var _         = require('lodash');
var mon       = require('mongoman');


//////////////////////////////////////////////////////////////////////////////////
//
// Test setup
//
//////////////////////////////////////////////////////////////////////////////////

mon.connect();

// register models
mon.registerAll(__dirname + '/../api/components', /_model$/i);

// store the server instance
var port = Math.floor(Math.random() * (999)) + 7000;
var api  = superTest(server(port, true));

// helper to return a new note object
function newNote () {
  return {
    title   : 'title - ' + new Date(),
    content : 'content - ' + new Date()
  };
}

// helper to parse a json body
function parse (body) {
  var json = {};

  try {
    json = JSON.parse(body);
  } catch (e) {}

  return json;
}


//////////////////////////////////////////////////////////////////////////////////
//
// Tests
//
//////////////////////////////////////////////////////////////////////////////////


describe('API Endpoints', function () {

  // Clear the databse before every test
  beforeEach(function (done){
    mon.drop('db');
    done();
  });

  describe('/notes', function () {

    //
    // Read
    //
    describe('Read', function () {

      it('should return a list of notes', function (done) {
        api.post('/notes').send(newNote()).end(function (err, result) {
          api.get('/notes').end(function (err, result) {
            var json = parse(result.text);
            expect(json.notes.length).to.above(0);
            done();
          });
        });
      });

      it('should allow note searching', function (done) {
        var prefix = 'foo';
        var note1  = newNote();
        var note2  = newNote();

        note2.title = prefix + ' - ' + note2.title;

        api.post('/notes').send(note1).end(function () {
          api.post('/notes').send(note2).end(function () {
            api.get('/notes?search=' + prefix).end(function (err, result) {
              // clean up the results
              var json = parse(result.text);

              // make sure only  one result was returned
              expect(json.notes.length).to.equal(1);

              // compare note
              expect(json.notes[0].title).to.equal(note2.title);
              expect(json.notes[0].content).to.equal(note2.content);

              done();
            });
          });
        });
      });
    });
  });

  describe('/notes', function () {

    //
    // Create
    //
    describe('Create', function () {

      it('should reject incomplete submission', function (done) {
        api.post('/notes').send().end(function (err, result) {
          var json = parse(result.text);
          expect(json.error).to.equal('Validation failed');
          expect(json.details[0].path).to.equal('content');
          expect(json.details[1].path).to.equal('title');
          done();
        });
      });

      it('should create a note for each request', function (done) {
        var note1 = newNote();
        var note2 = newNote();

        api.post('/notes').send(note1).end(function () {
          api.post('/notes').send(note2).end(function () {
            api.get('/notes').end(function (err, result) {
              // clean up the results
              var json   = parse(result.text);
              var notes  = json.notes || [];
              var _note1 = notes[0];
              var _note2 = notes[0];

              // compare note 1
              expect(_note1.title).to.equal(note1.title);
              expect(_note1.content).to.equal(note1.content);

              // ccmpare note 2
              expect(_note2.title).to.equal(note2.title);
              expect(_note2.content).to.equal(note2.content);

              done();
            });
          });
        });
      });
    });

    //
    // Rreead
    //
    describe('Read', function () {

      it('should 404 for unknown notes', function (done) {
        api.get('/notes/abcd').end(function (err, result) {
          expect(result.statusCode).to.equal(404);
          done();
        });
      });

      it('should return the specified note', function (done) {
        var note = newNote();

        api.post('/notes').send(note).end(function (err, createResult) {
          var _note = parse(createResult.text);

          api.get('/notes/' + _note._id).end(function (err, result) {
            var json = parse(result.text);
            expect(json.title).to.equal(note.title);
            done();
          });
        });
      });
    });


    //
    // Update
    //
    describe('Update', function () {

      it('should 404 for unknown notes', function (done) {
        api.put('/notes/abcd').end(function (err, result) {
          expect(result.statusCode).to.equal(404);
          done();
        });
      });

      it('should update the specified note', function (done) {
        var note    = newNote();
        var newText = 'foobar';

        api.post('/notes').send(note).end(function (err, createResult) {
          var _note = parse(createResult.text);

          api.put('/notes/' + _note._id).send({
            content : newText
          }).end(function (err, result) {
            var json = parse(result.text);
            expect(json.content).to.equal(newText);
            done();
          });
        });
      });
    });


    //
    // Destroy
    //
    describe('Destroy', function () {

      it('should 404 for unknown notes', function (done) {
        api.put('/notes/abcd').end(function (err, result) {
          expect(result.statusCode).to.equal(404);
          done();
        });
      });

      it('should delete the specified note', function (done) {
        var note    = newNote();

        api.post('/notes').send(note).end(function (err, createResult) {
          var _note = parse(createResult.text);

          api.delete('/notes/' + _note._id).end(function (err, result) {
            var json = parse(result.text);
            expect(json.success).to.equal(true);
            done();
          });
        });
      });
    });
  });
});