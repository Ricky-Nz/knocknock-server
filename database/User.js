import sequelize from './connection';
import { STRING, ENUM, BOOLEAN } from 'sequelize';
import Permission from './Permission';
import bcrypt from 'bcrypt';

const User = sequelize.define('user', {
	role: {
		type: ENUM,
		values: ['client', 'worker', 'admin'],
		allowNull: false
	},
	email: {
		type: STRING,
		allowNull: false,
		validate: {
			isEmail: true
		},
		unique: true
	},
	name: {
		type: STRING
	},
	contact: {
		type: STRING
	},
	avatarUrl: {
		type: STRING
	},
	password: {
		type: STRING,
		allowNull: false
	},
	emailVerified: {
		type: BOOLEAN,
		defaultValue: false
	},
	contactVerified: {
		type: BOOLEAN,
		defaultValue: false
	},
	verifyCode: {
		type: STRING
	},
	banned: {
		type: BOOLEAN,
		defaultValue: false
	},
	deleted: {
		type: BOOLEAN,
		defaultValue: false
	}
}, {
	hooks: {
		beforeCreate: user => {
			user.password = bcrypt.hashSync(user.password, 10);
		},
		afterCreate: (user, options, cb) => {
			Permission.create({
				userId: user.id
			})
			.then(permission => cb())
			.catch(err => cb(err));
		} 
	}
});

export default User;