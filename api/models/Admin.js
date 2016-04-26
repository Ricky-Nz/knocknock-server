/**
 * Admin.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    uid: {
      type: 'string',
      required: true,
      unique: true
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
  	},
  	root: {
  		type: 'boolean',
  		defaultsTo: false
  	},
  	beforeCreate: function (values, cb) {
      values.uid = DataProcessService.generateUUID();
  		values.password = DataProcessService.encryptPassword(values.password);
  		cb();
  	}
  }

};

