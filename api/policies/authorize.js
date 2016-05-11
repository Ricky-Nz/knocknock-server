var jwt = require('jsonwebtoken');
/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {
	// check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  if (!token) {
  	return res.forbidden('token not found');
  }

  jwt.verify(token, 'knocknockserver-secret-token', function(err, payload) {
    if (err||!payload) return res.forbidden('invalid token');

    User.findOne({uid: payload.id}, function (err, user) {
      if (err||!user) return res.forbidden('token user not found');

      req.user = user;
      next();
    });
  });
};
