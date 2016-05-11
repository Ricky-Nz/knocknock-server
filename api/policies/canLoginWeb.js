module.exports = function(req, res, next) {
	if (!req.user || !req.user.loginWeb) {
		return res.forbidden('LOGIN WEB PERMISSION DENIED');
	} else {
		next();
	}
}