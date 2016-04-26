/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	logIn: function (argument) {
		var err = UserService.checkLoginValidity(req);
		if (err) return res.badRequest(err);

		Admin
			.find({
				email: req.param('email'),
				password: UserService.encryptPassword(req.param('password'))
			})
			.then(function (admin) {
				if (!admin) throw 'email or password not correct';

				req.session.adminId = user.uid;
				return res.ok();
			})
			.catch(function (err) {
				res.badRequest(err);
			});
	}
};

