/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function login (req, res) {
	res.json({token: req.jwtToken});
}

function signUp (req, res, role, source) {
	console.log(req.file('email'));
	console.log(req.field('email'));
	var err = DataProcessService.checkLoginValidity(req);
	if (err) return res.badRequest(err);

	User
		.findOneByEmail(req.param('email'))
		.then(function (user) {
			if (user) throw 'email address already registed';

			return User.create({
				email: req.param('email'),
				password: req.param('password'),
				name: req.param('name'),
				contact: req.param('contact'),
				role: role,
				source: source
			});
		})
		.then(function (created) {
			if (!created) throw 'create user failed';

			StorageService.uploadToGCS(req.file('avatar'), function (err, imageUrl) {
				if (imageUrl) {
					User.update(created.id, {
						avatarUrl: imageUrl
					}, function (err, updated) {
						res.json(updated.toJSON());
					})
				} else {
					res.json(created.toJSON());
				}
			});
		})
		.catch(function (err) {
			res.badRequest(err);
		});
}

function getUser (res, role, query) {
	User.find({
		where: {
			role: role
		},
		skip: (query&&query.skip)||0,
		limit: (query&&query.limit)||20,
		sort: (query&&query.sort)||'source'
	}, function (err, users) {
		if (err) return res.badRequest(err);

		res.json(users);
	})
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
	register: function (req, res) {
		signUp(req, res, 'Client', 'REGISTER');
	},
	createClient: function (req, res) {
		signUp(req, res, 'Client', req.userId);
	},
	createWorker: function (req, res) {
		signUp(req, res, 'Worker', req.userId);
	},
	createAdmin: function (req, res) {
		signUp(req, res, 'Admin', req.userId);
	},
	getClient: function (req, res) {
		getUser(res, 'Client', req.query);
	},
	getWorker: function (req, res) {
		getUser(res, 'Worker', req.query);
	},
	getAdmin: function (req, res) {
		getUser(res, 'Admin', req.query);
	},
	test: function (req, res) {

	}
};