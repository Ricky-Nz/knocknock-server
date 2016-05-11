/**
 * LaundryOrderRecord.js
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
  	operatorId: {
  		type: 'string',
  		required: true
  	},
  	title: {
  		type: 'string'
  	},
  	before: {
  		type: 'string'
  	},
  	after: {
  		type: 'string'
  	},
  	description: {
  		type: 'string'
  	}
  }
};

