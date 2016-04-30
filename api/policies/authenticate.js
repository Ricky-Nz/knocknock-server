var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
	User.findOne({
		email: req.param('username')
	}, function (err, user) {
		if (err) return next(err);
		if (!user || !bcrypt.compareSync(req.param('password'), user.password)) {
			return next('username or password not correct');
		}

  var token = jwt.sign(user, app.get('superSecret'), {
    expiresInMinutes: 1440 // expires in 24 hours
  });

		req.userId = user.uid;
		next();
	});
};
