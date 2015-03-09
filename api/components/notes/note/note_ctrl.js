var mon = require('mongoman');
var err = require('../../../lib/error').errorGenerator;

var Note = mon.model('Note');

module.exports = {


  // Create
  //
  // Accepts Body:
  // {
  //   title : String // REQUIRED
  //   content : String // REQUIRED
  // }
  //
  // Returns: //created note
  // {
  //   _id     : Number,
  //   title   : String,
  //   content : String,
  //   created : Date
  // }
  //
  create : function (req, res, next) {
    // create a new note with the params provided
    mon.new('Note', {
      title   : req.body.title,
      content : req.body.content

    // save the note, we'll let mongoose handle validation defined in our schema
    }).save(function sendNote (error, note) {
      if (error) {
        // if there was a collision in the title submitted
        if (error.code == 11000) {
          return next(err('A note with that title already exists!'));

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
  // Returns: // note
  // {
  //   _id     : Number,
  //   title   : String,
  //   content : String,
  //   created : Date
  // }
  //
  read : function (req, res, next) {
    Note.findOne({
      _id : req.params.id
    }, function sendNote (error, note) {
      // a note with the provided ID is not in the database
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
  // Accepts Body:
  // {
  //   title : String // OPTIONAL
  //   content : String // OPTIONAL
  // }
  //
  // Returns: // updated note
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
    }, function updateNote (error, note) {
      // a note with the provided ID is not in the database
      if (!note) {
        return next({
          status : 404,
          error  : 'Note `' + req.params.id + '` not found'
        });

      // if the note is in the database, update it
      } else {
        // allow only title and content to be updated individually
        note.title   = req.body.title || note.title;
        note.content = req.body.content || note.content
        note.save(function (err, _note) {
          if (error) {
            return next(error);

          } else {
            return res.send(_note);
          }
        })
      }
    });
  },


  // Destroy
  //
  // Returns: // success or failure
  // {
  //   success : Boolean
  // }
  //
  destroy : function (req, res, next) {
    Note.findOne({
      _id : req.params.id
    }).remove(function sendNote (error, note) {
      // a note with the provided ID is not in the database
      if (!note) {
        return next({
          status : 404,
          error  : 'Note `' + req.params.id + '` not found'
        });

      } else {
        return res.send({
          success: true
        });
      }
    });
  }
};
