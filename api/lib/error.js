var _ = require('lodash');

//
// The error handler middleware cna be used to catch errors before they reach the wire.
// This allows us to intercept runtime errors and format them nicel before returning our
// resulting response to the client. This error handler will always return the following
//
//
// Status : Number // default 500. 400 if it cna be handled gracefully
// {
//   error : String // default to `Could not process request`. This is what we will display to the end user
//   details Mixed // defaults to null. This is used case-by-case for more robust handling
// }
//
// - Mongoose validation errors are handled gracefully and converted to the specified format
// - any non-handled error is sent ad a generic 500, and the stack trace is logged
// - the .errorGenerator() function will default to 400, since its specifically used (not a fallback)
//
//

//
// Error generator
//
// used to create simple errors more cleanly. complex errors should be interpreted by the middleware
exports.errorGenerator = function (seed, details, status) {
  return {
    error   : seed || 'Could not process request',
    status  : status || 400,
    details : details || null
  };
}

//
// middleware error handler
//
// bound to the server, executed when an error is passed to `next()`
exports.errorHandler = function (error, req, res, next) {
  if (error instanceof Error) {
    // handle mongoose validation errors gracefully
    if (error.name === 'ValidationError') {

      // set the appropriate properties
      error.status  = 400;
      error.error   = 'Validation failed';
      error.details = _.map(error.errors, function (err, index) {
        var isRequried = ~err.message.indexOf('is required');
        return {
          path    : err.path,
          message : isRequried ? 'Required' : err.message
        };
      });

      return sendErr(error);

    // if its a runtime error, send it and throw it to the console
    } else {

      return sendErr({
        error : 'Internal server error'
      });

      throw (error);
    }

  // if its not a run time error, send it
  } else {
    return sendErr(error);
  }


  // expect:
  // {
  //   status  : Number, // defaults to 500
  //   error   : String, // defaults to `Could not process request`
  //   details : Mixed // defaults to `null`
  // }
  function sendErr (err) {
    res.status(err.status || 500).send({
      error   : err.error || 'Could not process request',
      details : err.details || null
    });
  }
}