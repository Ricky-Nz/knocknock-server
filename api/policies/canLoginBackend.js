module.exports = function(req, res, next) {
	if (!req.user || !req.user.loginBackend) {
		return res.forbidden('LOGIN BACKEND PERMISSION DENIED');
	} else {
		next();
	}
}