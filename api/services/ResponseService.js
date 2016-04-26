module.exports = {
	permissionDenied: function (next) {
		next('Permission denied');
	}
};