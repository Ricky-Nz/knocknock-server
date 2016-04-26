module.exports = function(req, res, next) {
	if (req.session.userId && req.session.userId === req.param('userId')) {
		return next();
	} else {
		return next('Permission deny');
	}
}