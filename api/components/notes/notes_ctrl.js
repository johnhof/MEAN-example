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
      var regEx = new RegExp('^' + req.query.search,'i');

      Note.find({
        $or : [ // match against both the title and the body
          { title   : regEx },
          { content : regEx }
        ]
      }, function (error, notes) {
        if (error) {
          return next(error);
        } else {
          return res.send({
            notes : notes
          });
        }
      });

    // otherwise, get the latest players
    } else {
      Note.find({}).sort({
        created : 'descending' // sort from most to least recently created
      }).exec(function (error, notes) {
        if (error) {
          return next(error);
        } else {
          return res.send({
            notes : notes
          });
        }
      });
    }
  }
};