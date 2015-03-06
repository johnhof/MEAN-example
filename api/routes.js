exports.register = function register (server) {

  // Home
  var notes = require('./components/notes/notes_ctrl');
  server.get('/notes', notes.read); // Read

  // Note
  var note = require('./components/notes/note/note_ctrl');
  server.post('/notes', note.create); // Create
  server.get('/notes/:id', note.read); // Read
  server.put('/notes/:id', note.update); // Update
  server.delete('/notes/:id', note.destroy); // Destroy
};