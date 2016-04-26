/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
	signUp: function (req, res) {
		var err = UserService.checkLoginValidity(req);
		if (err) return res.badRequest(err);

		User
			.findOneByEmail(req.param('email'))
			.then(function (user) {
				if (user) throw 'email address already registed';

				return User.create({
					email: req.param('email'),
					password: UserService.encryptPassword(req.param('password')),
					uid: UserService.generateUUID()
				});
			})
			.then(function (created) {
				if (!created) throw 'create user failed';

				res.json(created.toJSON());
			})
			.catch(function (err) {
				res.badRequest(err);
			});
	},
	logIn: function (req, res) {
		var err = UserService.checkLoginValidity(req);
		if (err) return res.badRequest(err);

		User
			.find({
				email: req.param('email'),
				password: UserService.encryptPassword(req.param('password'))
			})
			.then(function (user) {
				if (!user) throw 'email or password not correct';

				req.session.userId = user.uid;
				return res.ok();
			})
			.catch(function (err) {
				res.badRequest(err);
			});
	},
	updateUser: function (req, res) {
		
	},
	getUser: function (req, res) {
		// body...
	},
	listUsers: function (req, res) {
		// body...
	}
};