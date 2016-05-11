var moment = require('moment');


	var generateOrderId = function (userId, orderNumber) {
		return moment().format('YYYYMMDD') + ('0000000' + userId).slice(-7) + ('0000' + orderNumber).slice(-4) ;
	}

console.log(generateOrderId(876, 88));