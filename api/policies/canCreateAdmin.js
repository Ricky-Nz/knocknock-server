module.exports = function(req, res, next) {
	if (!req.session.userId) {
		return ResponseService.permissionDenied(next);
	}

	Permission.findOne({ownerId: req.session.userId}, function (err, permission) {
		if (err) return next(err);

		if (permission.createAdmin) {
			next();
		} else {
			ResponseService.permissionDenied(next);
		}
	})
}