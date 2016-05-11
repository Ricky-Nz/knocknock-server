/**
 * LaundryOrderController
 *
 * @description :: Server-side logic for managing Laundryorders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
	createOrder: function (req, res) {
		OrderService.calculateOrderId(req.user.uid)
			.then(function (newOrderId) {
				return LaundryOrder.create(Object.assign({}, req.body, {
					id: newOrderId,
					userId: req.param('ownerId')||req.user.uid,
					status: 'pending worker'
				}));
			})
			.then(function (created) {
				OrderService.createRecord(req.user.uid, 'CREATE', created);

				res.json(created.toJSON());
			})
			.catch(function (err) {
				res.badRequest(err);
			});
	},
	updateOrder: function (req, res) {
		LaundryOrder.update({id: req.param('orderId')}, req.body)
			.then(function (updated) {
				OrderService.createRecord(req.user.uid, 'UPDATE', updated[0]);

				res.json(updated[0].toJSON());
			})
			.catch(function (err) {
				res.badRequest(err);
			});
	}
};

