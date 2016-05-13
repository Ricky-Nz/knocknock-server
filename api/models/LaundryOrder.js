/**
 * LaundryOrder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {
  attributes: {
  	id: {
  		type: 'string',
  		primaryKey: true
  	},
  	uid: {
  		type: 'string',
  		required: true
  	},
  	express: {
  		type: 'boolean',
  		defaultsTo: false
  	},
  	note: {
  		type: 'string'
  	},
  	status: {
  		type: 'string',
  		enum: ['pending worker', 'worker found', 'awaiting pick up/driver on the way',
  			'picked up', 'picked up failed', 'laundry in process', 'laundry complete',
  			'awaiting drop off/driver on the way', 'dropped off', 'drop off failed',
  			'order complete', 'deleted', 'awaiting loading', 'on the way']
  	},
  	totalPrice: {
  		type: 'float'
  	},
  	pickupDate: {
  		type: 'date'
  	},
  	pickupAddress: {
  		type: 'string'
  	},
  	pickupPostal: {
  		type: 'string'
  	},
  	pickupWorkerId: {
  		type: 'string'
  	}
  },
  beforeCreate: function (values, cb) {
    OrderService.calculateOrderId(values.uid)
      .then(function (newOrderId) {
        values.id = newOrderId;
        values.status = 'pending worker';
        cb();
      })
      .catch(function (err) {
        cb(err);
      });
  },
  afterCreate: function (newlyInsertedRecord, cb) {
    OrderService.createRecord(newlyInsertedRecord.uid, 'CREATE', newlyInsertedRecord);
    cb();
  },
  afterUpdate: function (updatedRecord, cb) {
    OrderService.createRecord(updatedRecord.uid, 'UPDATE', updatedRecord);
    cb();
  }
};

