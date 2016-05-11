module.exports = function(req, res, next) {
	if (!req.user || !req.user.loginApp) {
		return res.forbidden('LOGIN APP PERMISSION DENIED');
	} else {
		next();
	}
}