module.exports = function(req, res, next) {
	var ownerId = req.param('ownerId');
	if (ownerId&&ownerId !== req.user.uid) {
		if (!req.user.insteadCreateOrder) {
			res.forbidden('INSTEAD CREATE ORDER PERMISSION DENIED');	
		} else {
			next();
		}
	} else {
		if (!req.user.createOrder) {
			res.forbidden('CREATE ORDER PERMISSION DENIED');	
		} else {
			next();
		}
	}
}