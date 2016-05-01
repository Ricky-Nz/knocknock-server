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

    values.uid = DataProcessService.generateUUID();
    cb();
  },
  beforeCreate: function (values, cb) {
    values.password = DataProcessService.encryptPassword(values.password);
    values.banned = false;
    values.deleted = false;
    values.verifyCode = null;
    values.verified = false;
    cb();
  },
  afterCreate: function (newUser, cb) {
    var permission = {
      ownerId: newUser.uid
    };

    if (newUser.role === 'Client') {
      permission.loginApp = true;
      permission.loginWeb = true;
    } else if (newUser.role === 'Worker') {
      permission.loginApp = true;
    } else if (newUser.role === 'Admin') {
      permission.loginBackend = true;
      permission.readUser = true;
      permission.writeUser = true;
      permission.readWorker = true;
      permission.writeWorker = true;
    } else if (newUser.role === 'Root') {
      permission.loginBackend = true;
      permission.readUser = true;
      permission.writeUser = true;
      permission.readWorker = true;
      permission.writeWorker = true;
      permission.createWorker = true;
      permission.createAdmin = true;
    }

    Permission.create(permission).then(function (created) {
      cb();
    }).catch(function (err) {
      cb(err);
    });
  }
};

