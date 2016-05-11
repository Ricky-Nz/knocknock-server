/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function login (req, res) {
	res.json({token: req.jwtToken});
}

function signUp (req, res, role) {
	User.create(Object.assign({}, req.body, {
		role: role,
		source: req.user?req.user.uid:'REGISTER'
	}))
	.then(function (created) {
		if (!created) throw 'create user failed';

		res.json(created.toJSON());
	})
	.catch(function (err) {
		res.badRequest(err);
	});
}

function getUser (req, res, role) {
	var selectId = req.param('id');
	if (selectId) {
		User.findOne({
			role: role,
			uid: selectId
		}, function (err, user) {
			if (err||!user) return res.badRequest(err);

			res.json(user.toJSON());
		});
	} else {
		var query = req.query;
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
		signUp(req, res, 'Client');
	},
	createClient: function (req, res) {
		signUp(req, res, 'Client');
	},
	createWorker: function (req, res) {
		signUp(req, res, 'Worker');
	},
	createAdmin: function (req, res) {
		signUp(req, res, 'Admin');
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