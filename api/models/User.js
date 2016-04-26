/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {
  _config: {
    rest: false
  },
  attributes: {
    uid: {
      type: 'string',
      unique: true,
      required: true
    },
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
    verified: {
      type: 'boolean',
      defaultsTo: false
    },
    verifyCode: {
      type: 'string'
    },
  	banned: {
  		type: 'boolean',
  		defaultsTo: false
  	},
  	deleted: {
  		type: 'boolean',
  		defaultsTo: false
  	},
  	toJSON: function() {
  		var obj = this.toObject();
  		obj.id = obj.uid;
      delete obj.uid;
  		delete obj.password;
      delete obj.verifyCode;
  		return obj;
  	}
  }
};

