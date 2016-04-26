var bcrypt = require('bcrypt');
var uuid = require('node-uuid');

module.exports = {
	encryptPassword: function (password) {
		return bcrypt.hashSync(password, 10);
	},
	generateUUID: function () {
		return uuid.v4();
	}
};