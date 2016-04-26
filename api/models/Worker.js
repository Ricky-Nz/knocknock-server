/**
 * Worker.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
  	uid: {
  		type: 'string',
  		unique: true,
  		required: true
  	},
  	email: {
  		type: 'string',
  		required: true,
  		unique: true,
  		email: true
  	},
  	password: {
  		type: 'string',
  		required: true
  	}
  }
};

