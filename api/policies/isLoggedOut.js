module.exports = function(req, res, next) {
  if (!req.session.userId) {
    return next();
  }

  return res.forbidden('You are not permitted to perform this action.');
};