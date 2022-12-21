const ApiError = require('../exeptions/api-error');

module.exports = function errorMiddleware(err, req, res, next) {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: 'Unexpected error' })
}
