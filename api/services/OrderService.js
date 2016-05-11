var moment = require('moment');
var Q = require('q');

module.exports = {
	calculateOrderId: function (userId) {
		return Q.Promise(function(resolve, reject) {
			var idprefix = moment().format('YYYYMMDD') + ('0000000' + userId).slice(-7);
			LaundryOrder.findOne({where: {id: {startsWith: idprefix}}, sort: 'id DESC'}, function (err, lastOrder) {
				if (err) return reject(err);

				var count = lastOrder?(parseInt(lastOrder.id.slice(15)) + 1):1;
				resolve(idprefix + ('000' + count).slice(-3));
			});
		});
	},
	createRecord: function (operator, title, order) {
		var json = order.toJSON();
		for (var key in json) {
			LaundryOrderRecord.create({
				orderId: json.id,
				operatorId: operator,
				title: title,
				after: json[key],
				description: key
			}, function () {});
		}
	}
};