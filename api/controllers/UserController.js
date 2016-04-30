/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function login (req, res) {
	req.session.userId = req.userId;
  var token = jwt.sign(user, app.get('superSecret'), {
    expiresInMinutes: 1440 // expires in 24 hours
  });
	res.json({token: token});
}

function signUp (req, res, role) {
	var err = DataProcessService.checkLoginValidity(req);
	if (err) return res.badRequest(err);

	User
		.findOneByEmail(req.param('email'))
		.then(function (user) {
			if (user) throw 'email address already registed';

			return User.create({
				email: req.param('email'),
				password: req.param('password'),
				role: role
			});
		})
		.then(function (created) {
			if (!created) throw 'create user failed';

			res.json(created.toJSON());
		})
		.catch(function (err) {
			res.badRequest(err);
		});
}

module.exports = {
	appLogIn: function (req, res) {
		login(req, res);
	},
	webLogIn: function (req, res) {
		login(req, res);
	},
	backendLogIn: function (req, res) {
		login(req, res);
	},
	createUser: function (req, res) {
		signUp(req, res, 'User');
	},
	createWorker: function (req, res) {
		signUp(req, res, 'Worker');
	},
	createAdmin: function (req, res) {
		signUp(req, res, 'Admin');
	},
	listUsers: function (req, res) {
		res.ok();
	}
};