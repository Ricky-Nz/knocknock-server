import sequelize from './connection';
import { toGlobalId } from 'graphql-relay';
import { STRING, ENUM, BOOLEAN } from 'sequelize';
import Permission from './Permission';
import Wallet from './Wallet';
import bcrypt from 'bcrypt';

const User = sequelize.define('user', {
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
	avatarId: {
		type: STRING
	},
	avatarBucket: {
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
	enabled: {
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
			Wallet.create({
				userId: toGlobalId('User', user.id),
				credit: 0,
			})
			.then(() => Permission.create({
				userId: toGlobalId('User', user.id)
			}))
			.then(() => cb())
			.catch(err => cb(err));
		} 
	}
});

export default User;