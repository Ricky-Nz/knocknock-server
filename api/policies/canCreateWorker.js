module.exports = function(req, res, next) {
	if (!req.user || !req.user.createWorker) {
		return res.forbidden('CREATE WORKER PERMISSION DENIED');
	} else {
		next();
	}
}