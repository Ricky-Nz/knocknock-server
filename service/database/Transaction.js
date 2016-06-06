import sequelize from './connection';
import { STRING, ENUM, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('transaction', {
	walletId: {
		type: STRING,
		allowNull: false
	},
	value: {
		type: INTEGER,
		allowNull: false
	},
	currency: {
		type: STRING,
		allowNull: false
	},
	referenceNo: {
		type: STRING,
		allowNull: false
	},
	paymentMode: {
		type: STRING,
		allowNull: false
	},
	paymentChannel: {
		type: STRING,
		allowNull: false
	},
	status: {
		type: ENUM,
		values: ['PENDING', 'APPROVED', 'REJECTED'],
		allowNull: false
	}
});