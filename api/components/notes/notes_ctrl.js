var mon = require('mongoman');

var Note = mon.model('Note');

module.exports = {


  // Read
  //
  // Query Params:
  // {
  //   search : String, // OPTIONAL - return notes that contain this sting in the title or content
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

    // perform a search if the query param was provided
    if (req.query.search) {
      // match from the beginning of a word,
      var regEx = new RegExp('(^|\\s+)' + req.query.search,'i');

      Note.find({
        $or : [ // accept both title and content matches
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