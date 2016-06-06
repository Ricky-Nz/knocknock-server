import sequelize from './connection';
import { STRING, DATE, ENUM, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('order', {
	serialNumber: {
		type: STRING,
		allowNull: false,
		unique: true
	},
	userId: {
		type: STRING,
		allowNull: false
	},
	express: {
		type: BOOLEAN,
		defaultsTo: false
	},
	note: {
		type: STRING
	},
	status: {
		type: ENUM,
		values: ['pending worker', 'worker found', 'awaiting pick up/driver on the way',
			'picked up', 'picked up failed', 'laundry in process', 'laundry complete',
			'awaiting drop off/driver on the way', 'dropped off', 'drop off failed',
			'order complete', 'deleted', 'canceled', 'awaiting loading', 'on the way'],
		allowNull: false
	},
	totalPrice: {
		type: FLOAT
	},
	pickupDate: {
		type: DATE
	},
	pickupTime: {
		type: STRING
	},
	pickupAddress: {
		type: STRING
	},
	pickupWorkerId: {
		type: STRING
	}
});