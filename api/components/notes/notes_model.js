var mon = require('mongoman');

// register a new model `Note`
module.exports = mon.register('Note', {

  // `title` is a required unique alphanumeric string
  title : mon('Title').string().unique().required().fin(),

  // `Content` is a required string that must be less than 500 characters
  content : mon('Content').string().required().max(500).fin(),

  // `Created` is a required date that defaults to now
  created : mon().date().required().default(Date.now).fin(),

});