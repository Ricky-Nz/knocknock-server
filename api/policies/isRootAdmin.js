module.exports = function(req, res, next) {
	if (!req.session.userId) {
		return ResponseService.permissionDenied(next);
	}

	Admin.findOne({uid: req.session.userId}, function (err, admin) {
		if (err) return next(err);

		if (!admin || !admin.root) {
			ResponseService.permissionDenied(next);
		} else {
			next();
		}
	})
}