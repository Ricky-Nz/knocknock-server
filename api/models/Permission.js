/**
 * Permission.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
  	ownerId: {
  		type: 'string',
  		required: true,
  		unique: true
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
  	}
  }
};

