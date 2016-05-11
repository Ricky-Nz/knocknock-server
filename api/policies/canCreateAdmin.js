module.exports = function(req, res, next) {
	if (!req.user || !req.user.createAdmin) {
		return res.forbidden('CREATE ADMIN PERMISSION DENIED');
	} else {
		next();
	}
}