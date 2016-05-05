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
				avatarUrl: req.param('avatarUrl'),
				role: role,
				source: source
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

function processGetUser (req, res, role) {
	var selectId = req.param('id');
	if (selectId) {
		getUserById(res, role, selectId);
	} else {
		getUser(res, role, req.query);
	}
}

function getUser (res, role, query) {
	var selection = {
		role: role
	};

	if (query.search) {
		selection.or = [
			{name: {'contains': query.search}},
			{contact: {'contains': query.search}}
		];
	}

	User.count({
		where: selection	
	}, function (err, count) {
		if (err) return res.badRequest(err);

		User.find({
			where: selection
		}).paginate({
			page: (query&&query.page)||1,
			limit: (query&&query.limit)||20
		}).exec(function (err, users) {
			if (err) return res.badRequest(err);

			res.json({
				total: count,
				data: users
			});
		});
	});
}

function getUserById (res, role, id) {
	User.findOne({
		role: role,
		uid: id
	}, function (err, user) {
		if (err||!user) return res.badRequest(err);

		res.json(user.toJSON());
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
		processGetUser(req, res, 'Client');
	},
	getWorker: function (req, res) {
		processGetUser(req, res, 'Worker');
	},
	getAdmin: function (req, res) {
		processGetUser(req, res, 'Admin');
	},
	fileUpload: function (req, res) {
		StorageService.uploadToGCS(req.file('avatar'), function (err, fileUrl) {
			if (err) return res.badRequest(err);

			res.json({
				fileUrl: fileUrl
			});
		});
	}
};