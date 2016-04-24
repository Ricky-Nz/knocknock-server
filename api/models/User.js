/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	email: {
  		type: 'string',
  		email: true,
  		required: true,
  		unique: true
  	},
  	password: {
  		type: 'string',
  		required: true
  	},
  	role: {
  		type: 'string',
  		enum: ['root', 'admin', 'user', 'worker'],
  		required: true
  	},
  	banned: {
  		type: 'boolean',
  		defaultTo: false
  	},
  	deleted: {
  		type: 'boolean',
  		defaultTo: false
  	},
  	toJSON: function(argument) {
  		var obj = this.toObject();
  		delete obj.id;
  		delete obj.password;
  		delete obj.banned;
  		delete obj.deleted;
  		return obj;
  	}
  }
};

