var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
	User.findOne({
		email: req.param('username')
	}, function (err, user) {
		if (err) return next(err);

		if (!user || !bcrypt.compareSync(req.param('password'), user.password)) {
			return res.badRequest('username or password not correct');
		}

	  jwt.sign({id: user.uid}, 'knocknockserver-secret-token', {
	    expiresIn: '7d'
	  }, function (err, token) {
	  	if (err) return next(err);

	  	req.user = user;
			req.jwtToken = token;
			next();
	  });
	});
};
