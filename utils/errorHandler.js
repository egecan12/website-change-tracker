// This is a middleware function for handling errors in Express.js.

exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
};
