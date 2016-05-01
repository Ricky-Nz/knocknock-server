module.exports = function(req, res, next) {
	if (!req.userId) {
		return ResponseService.permissionDenied(next);
	}

	Permission.findOne({ownerId: req.userId}, function (err, permission) {
		if (err) return next(err);

		if (permission.createAdmin) {
			next();
		} else {
			ResponseService.permissionDenied(next);
		}
	})
}