import sequelize from './connection';
import { STRING, ENUM, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('transaction', {
	userId: {
		type: STRING,
		allowNull: false
	},
	value: {
		type: INTEGER,
		allowNull: false
	},
	type: {
		type: ENUM,
		values: ['deposit', 'payorder'],
		allowNull: false
	},
	orderId: {
		type: STRING
	},
	description: {
		type: STRING
	}
});