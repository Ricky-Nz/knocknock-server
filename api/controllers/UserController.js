var validator = require('validator');
/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	signup: function (req, res) {
		if (!validator.isEmail(req.param('email'))) {
			return res.badRequest('An email address is required!');
		} else {
			return res.json('success');
		}
	}
};