import sequelize from './connection';
import { STRING, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('worker', {
	email: {
		type: STRING,
		allowNull: false,
		isEmail: true
	},
	password: {
		type: STRING,
		allowNull: false
	},
	name: {
		type: STRING,
		allowNull: false
	},
	contact: {
		type: STRING,
		allowNull: false
	},
	avatarUrl: {
		type: STRING
	},
	avatarId: {
		type: STRING
	},
	avatarBucket: {
		type: STRING
	}
});