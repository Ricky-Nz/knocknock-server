/**
 * LaundryOrderItem.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {
  attributes: {
  	orderId: {
  		type: 'string',
  		required: true
  	},
  	productId: {
  		type: 'string',
  		required: true
  	},
  	laundryType: {
  		type: 'string',
  		required: true
  	},
  	quantity: {
  		type: 'integer',
  		required: true
  	},
  	totalPrice: {
  		type: 'float',
  		required: true
  	}
  }
};

