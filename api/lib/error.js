var _ = require('lodash');

//
// Error generator
//
exports.errorGenerator = function (seed, details, status) {

  // allow mongoose errors to pass in directly
  if (seed.message && !details) {
    details = _.map(seed.errors, function (err, index) {
      // shorthand these required errors for now. we may need to create more specific messaging later
      if (/is required/.test(err.message)) {
        err.message = 'Required';
      }

      return {
        path    : err.path,
        message : err.message
      }
    });

    seed = seed.message;
  }

  return {
    error   : seed || 'Could not process request',
    status  : status || 400,
    details : details || null
  };
}

//
// middleware error handler
//
exports.errorHandler = function (error, req, res, next) {
  if (error instanceof Error) {
    if (error.name === 'ValidationError') {
      // duck type the val error
      error.type = error.message && !error.details ? 'mongoose' : 'joi';
      return sendErr(exports.errorGenerator(error));

    } else {

      sendErr({
        error : 'Internal server error'
      });

      throw (error);
    }
  } else {
    return sendErr(error);
  }


  function sendErr (err) {
    res.status(err.status || 500).send({
      error   : err.error || 'Could not process request',
      details : err.details || null
    });
  }
}