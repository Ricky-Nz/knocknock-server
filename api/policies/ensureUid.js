module.exports = function(req, res, next) {
	req.body.uid = req.user.uid;
	next();
}