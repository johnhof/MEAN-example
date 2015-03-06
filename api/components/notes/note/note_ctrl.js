var mon = require('mongoman');
var _   = require('lodash');
var err = require('../../../lib/error').errorGenerator;

var Note = mon.model('Note');

module.exports = {


  // Create
  //
  // Returns:
  // {
  //   _id     : Number,
  //   title    : String,
  //   content : String,
  //   created : Date
  // }
  //
  create : function (req, res, next) {
    mon.new('Note', {
      title   : req.body.title,
      content : req.body.content
    }).save(function sendNote (error, note) {
      if (error) {
        if (error.code == 11000) {
          return next(err('A note with that title already exists!'))
        } else {
          return next(error);
        }
      } else {
        return res.send(note);
      }
    });
  },


  // Read
  //
  // Returns:
  // {
  //   _id     : Number,
  //   title    : String,
  //   content : String,
  //   created : Date
  // }
  //
  read : function (req, res, next) {
    Note.findOne({
      _id : req.params.id
    }, sendNoteCallback(res, next));
  },


  // Update
  //
  // Returns:
  // {
  //   _id     : Number,
  //   title    : String,
  //   content : String,
  //   created : Date
  // }
  //
  update : function (req, res, next) {
    Note.findOne({
      _id : req.params.id
    }, sendNoteCallback(res, next));
  },


  // Destroy
  //
  // Returns:
  // {
  //   _id     : Number,
  //   title    : String,
  //   content : String,
  //   created : Date
  // }
  //
  destroy : function (req, res, next) {
    Note.findOne({
      _id : req.params.id
    }).remove(sendNoteCallback(res, next));
  }
};

//
// Helpers
//

function sendNoteCallback (res, next) {
  return function sendNote (error, note) {
    console.log(error)
    if (error) {
      return next(error);
    } else {
      return res.send(note);
    }
  }
}