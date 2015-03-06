var mon = require('mongoman');
var _   = require('lodash');

var Note = mon.model('Note');

module.exports = {


  // Read
  //
  // Query Params:
  // {
  //   search : String, // OPTIONAL - return notes that contain this sting in the body of title
  //   start  : Number, // OPTIONAL - offset this many values and return the result. defaults to 0
  //   count  : Number // OPTIONAL - number of items returned. default 10
  // }
  //
  // Returns:
  // [{
  //   _id     : Number,
  //   title   : String,
  //   content : String,
  //   created : Date
  // }]
  //
  read : function (req, res, next) {

    // search is the query param was provided
    if (req.query.search) {
      Note.search(req.query, sendNotes);

    // otherwise, get the latest players
    } else {
      Note.recent(req.query, sendNotes);
    }

    // helper callback to send note results
    function sendNotes (error, notes) {
      console.log(notes)
      if (error) {
        return next(error);
      } else {

        // add the href to each note
        _.each(notes || [], function (note, index) {
          notes[index].href = '/notes/' + notes._id;
          delete notes[index].__v;
        });

        return res.send(notes);
      }
    }
  }
};