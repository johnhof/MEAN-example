var express = require('express'); // use the expres framework
var colors  = require('colors'); // pretty logging
var mon     = require('mongoman'); // helps with MongoDB management

// internal modules
var routes = require('./api/routes'); // include our routes
var err    = require('./api/lib/error'); // include our custom error handler

// express middleware
var json       = require('express-json'); // helps manage headers
var bodyParser = require('body-parser'); // a set of request parsers

// export the server for testing
module.exports = startServer;

// if this is a test, dont run the setup functions
if (require.main !== module) { // if run as a module, not the command line
  return;
}

//////////////////////////////////////////////////////////////////////////////////
//
// Connect to the mongo database
//
//////////////////////////////////////////////////////////////////////////////////

// if the connection is successful
mon.goose.connection.on("open", function (ref) {
  console.log("\n  Connected to mongo server!\n".blue);

  // register models
  mon.registerAll(__dirname + '/api/components', /_model$/i);

  // exec server startup
  startServer();
});

// if the connection fials
mon.goose.connection.on("error", function (err) {
  console.log("\n!! Could not connect to mongo server !! \n    Try running `[sudo] mongod` in another terminal\n".red);
  process.kill();
});

// connect to the localhost default database
mon.connect(/* pass in the ID for your database on the live server */);


//////////////////////////////////////////////////////////////////////////////////
//
// Build and start the server
//
//////////////////////////////////////////////////////////////////////////////////

// allow sor log supression for the sake of tests
function startServer (portOverride, suppressLogs) {

  // define the server and an express server
  var server = express();

  // load the config.json file from the current directory
  server.config = require('config.json')();

  // apply midleware modules
  server.use(json()); // handle Content-Type based on Accept header
  server.use(bodyParser.urlencoded({ extended: true })); // parse urlencoded bodies
  server.use(bodyParser.json()); //  parses json bodies

  // Deliver the static files defined in teh config
  for (staticDir in server.config.staticMap) {
    server.use(staticDir, express.static(__dirname + server.config.staticMap[staticDir]));
  }

  // prime routes to set headers and log out route details
  server.use(function init (req, res, next) {
    // set response headers used in every request
    res.set({
      'Content-Type': 'application/json' // we will always return json
    });

    // log the request
    if (!suppressLogs) {
      console.log('  ' + (req.method).cyan.dim + ' ' + (req.url).grey.dim);
    }

    return next();
  });

  // register API routes
  routes.register(server);

  // register error handler
  server.use(err.errorHandler);

  // home should return the index.html page (in other words, our angular app)
  server.get('/', function (req, res) {
    // respond with html, instead of json
    res.set({ 'Content-Type': 'text/html; charset=utf-8' });

    // log the request and send the application file
    if (!suppressLogs) {
      console.log('  ' + (req.method).cyan.dim + ' ' + (req.url).grey.dim);
    }
    res.sendFile(__dirname + '/dist/index.html');

  });

  var finalPort = portOverride || server.config.port;
  server.listen(finalPort);

  if (!suppressLogs) {
    console.log('\n  Listening on port '.green + (finalPort + '').blue + '\n');
  }

  return server;
}
