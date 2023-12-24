import createHttpError from "http-errors";

// 404 not found handler
function notFoundHandler(req, res, next) {
  res.redirect(`https://6587b600b2a7d7f9e64e8b37--glowing-gecko-958940.netlify.app/404`);
  next(createHttpError(404, 'Your requested content was not found!'));

}

// default error handler
function errorHandler(err, req, res, next) {
  console.log(err);
  res.status(404).json({
    error: err
  })
}

export { notFoundHandler, errorHandler }