/**
 * LaundryProduct.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {
  attributes: {
  	id: {
  		type: 'string',
  		required: true,
  		unique: true
  	},
  	nameEn: {
  		type: 'string',
  		required: true
  	},
  	nameCn: {
  		type: 'string',
  		required: true
  	},
  	washPrice: {
  		type: 'float',
  		required: true
  	},
  	dryCleanPrice: {
  		type: 'float',
  		required: true
  	},
  	ironPrice: {
  		type: 'float',
  		required: true
  	},
  	washPriceDiscount: {
  		type: 'float',
  		required: true
  	},
  	dryCleanPriceDiscount: {
  		type: 'float',
  		required: true
  	},
  	ironPriceDiscount: {
  		type: 'float',
  		required: true
  	},
  	special: {
  		type: 'boolean',
  		defaultsTo: false
  	},
  	imageUrl: {
  		type: 'string',
  		required: true
  	}
  }
};