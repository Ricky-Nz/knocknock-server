import sequelize from './connection';
import { STRING, DATE, ENUM, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

const LaundryOrder = sequelize.define('laundryorder', {
	userId: {
		type: INTEGER,
		required: true
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
			'order complete', 'deleted', 'awaiting loading', 'on the way'],
		allowNull: false
	},
	totalPrice: {
		type: FLOAT
	},
	pickupDate: {
		type: DATE
	},
	pickupAddress: {
		type: STRING
	},
	pickupPostal: {
		type: STRING
	},
	pickupWorkerId: {
		type: STRING
	}
}, {
	hooks: {
		
	}
});

export default LaundryOrder;