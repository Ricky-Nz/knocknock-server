module.exports = function(req, res, next) {
	User
		.findOneByEmail(req.param('email'))
		.then(function (user) {
			next(user?'email address already registed':null);
		})
		.catch(function (err) {
			next(err);
		});
}