module.exports = function(req, res, next) {
	if (!req.userId) {
		return ResponseService.permissionDenied(next);
	}

	console.log(req.userId);
	Permission.findOne({ownerId: req.userId}, function (err, permission) {
		if (err) return next(err);

		if (permission&&permission.createWorker) {
			next();
		} else {
			ResponseService.permissionDenied(next);
		}
	})
}