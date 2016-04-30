var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var validator = require('validator');

module.exports = {
	checkLoginValidity: function (req) {
		var email = req.param('email');
		var password = req.param('password');

		if (!validator.isEmail(email)) {
			return 'Not email valied email address!';
		} else if (!password || password.length < 6) {
			return 'Password must has at least 6 digit!';
		}
	},
	encryptPassword: function (password) {
		return bcrypt.hashSync(password, 10);
	},
	generateUUID: function () {
		return uuid.v4();
	}
};