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
    }, function sendNote (error, note) {
      if (!note) {
        return next({
          status : 404,
          error  : 'Note `' + req.params.id + '` not found'
        });
      } else {
        return res.send(note);
      }
    });
  },


  // Update
  //
  // Returns:
  // {
  //   _id     : Number,
  //   title   : String,
  //   content : String,
  //   created : Date
  // }
  //
  update : function (req, res, next) {
    Note.findOne({
      _id : req.params.id
    }, function sendNote (error, note) {
      if (error) {
        return next(error);
      } else {
        return res.send(note);
      }
    });
  },


  // Destroy
  //
  // Returns:
  // {
  //   _id     : Number,
  //   title   : String,
  //   content : String,
  //   created : Date
  // }
  //
  destroy : function (req, res, next) {
    Note.findOne({
      _id : req.params.id
    }).remove(function sendNote (error, note) {
      if (error) {
        return next(error);
      } else {
        return res.send({
          success: true
        });
      }
    });
  }
};
