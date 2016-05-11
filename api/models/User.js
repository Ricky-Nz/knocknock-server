/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {
  attributes: {
    uid: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    role: {
      type: 'string',
      required: true
    },
  	email: {
  		type: 'string',
  		email: true,
  		required: true,
  		unique: true
  	},
    name: {
      type: 'string'
    },
    contact: {
      type: 'string'
    },
    avatarUrl: {
      type: 'string'
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
    source: {
      type: 'string',
      required: true
    },
    loginApp: {
      type: 'boolean',
      defaultsTo: false
    },
    loginWeb: {
      type: 'boolean',
      defaultsTo: false
    },
    loginBackend: {
      type: 'boolean',
      defaultsTo: false
    },
    createWorker: {
      type: 'boolean',
      defaultsTo: false
    },
    createAdmin: {
      type: 'boolean',
      defaultsTo: false
    },
    readUser: {
      type: 'boolean',
      defaultsTo: false
    },
    writeUser: {
      type: 'boolean',
      defaultsTo: false
    },
    readWorker: {
      type: 'boolean',
      defaultsTo: false
    },
    writeWorker: {
      type: 'boolean',
      defaultsTo: false
    },
    createOrder: {
      type: 'boolean',
      defaultsTo: false
    },
    insteadCreateOrder: {
      type: 'boolean',
      defaultsTo: false
    },
  	toJSON: function () {
  		var obj = this.toObject();
  		obj.id = obj.uid;
      delete obj.uid;
  		delete obj.password;
      delete obj.verifyCode;
  		return obj;
  	}
  },
  beforeValidate: function (values, cb) {
    if (['Client', 'Worker', 'Admin', 'Root'].indexOf(values.role) < 0) {
      return cb('role not supported');
    }

    cb();
  },
  beforeCreate: function (values, cb) {
    values.password = DataProcessService.encryptPassword(values.password);
    if (values.role === 'Client') {
      values.loginApp = true;
      values.loginWeb = true;
      values.createOrder = true;
    } else if (values.role === 'Worker') {
      values.loginApp = true;
    } else if (values.role === 'Admin') {
      values.loginBackend = true;
      values.readUser = true;
      values.writeUser = true;
      values.readWorker = true;
      values.writeWorker = true;
      values.createOrder = true;
      values.insteadCreateOrder = true;
    } else if (values.role === 'Root') {
      values.loginApp = true;
      values.loginWeb = true;
      values.loginBackend = true;
      values.readUser = true;
      values.writeUser = true;
      values.readWorker = true;
      values.writeWorker = true;
      values.createWorker = true;
      values.createAdmin = true;
      values.createOrder = true;
      values.insteadCreateOrder = true;
    }
    cb();
  }
};

