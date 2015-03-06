var mon = require('mongoman');

// register a new model `Note`
module.exports = mon.register('Note', {

  // `title` is a required unique alphanumeric string
  title : mon('Title').string().unique().alphanum().required().fin(),

  // `Content` is a required string that must be less than 500 characters
  content : mon('Content').string().required().max(500).fin(),

  // `Created` is a required date that defaults to now
  created : mon().date().required().default(Date.now).fin(),

}, {
  // bind static functions to the model
  statics : {

    // search
    //
    // parameters:
    // {
    //   search, : String // REQUIRED - return notes that contain this sting in the body of title
    //   start,  : Number // OPTIONAL - offset this many values and return the result. defaults to 0
    //   count  : Number // OPTIONAL - number of items returned. default 10
    // }
    search : function (inputs, callback) {
      inputs  = inputs || {};

      var regEx = new RegExp(inputs.search,'i');

      this.find({
        // match against both the title and the body
        $or : [
          { title    : regEx },
          { content : regEx }
        ]
      }, {}, {
        // pagination
        skip  : inputs.start || 0,
        limit : inputs.count || 10
      }).exec(callback);
    },


    // recent
    //
    // parameters:
    // {
    //   start,  : Number // OPTIONAL - offset this many values and return the result. defaults to 0
    //   count  : Number // OPTIONAL - number of items returned. default 10
    // }
    recent : function (inputs, callback) {
      this.find({}, {}, {
        // pagination
        skip  : inputs.start || 0,
        limit : inputs.count || 10
      }).sort({
        // sort from most to leasst recently created
        created : 'descending'
      }).exec(callback);
    }
  }
});