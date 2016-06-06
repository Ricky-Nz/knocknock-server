import sequelize from './connection';
import { STRING, ENUM, BOOLEAN, FLOAT, DATE } from 'sequelize';

export default sequelize.define('voucher', {
	userId: {
		type: STRING,
		allowNull: false
	},
	title: {
		type: STRING,
		allowNull: false
	},
	vlaue: {
		type: FLOAT,
		allowNull: false
	},
	expireOn: {
		type: DATE,
		allowNull: false
	},
	used: {
		type: BOOLEAN,
		defaultValue: false
	},
	usedAt: {
		type: DATE
	},
	usedOnOrderId: {
		type: STRING
	}
});