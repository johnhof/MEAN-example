var mon = require('mongoman');
var _   = require('lodash');

var Note = mon.model('Note');

module.exports = {


  // Read
  //
  // Query Params:
  // {
  //   search : String, // OPTIONAL - return notes that contain this sting in the body of title
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
      // match words only
      var regEx = new RegExp('(^|\\s+)' + req.query.search,'i');

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