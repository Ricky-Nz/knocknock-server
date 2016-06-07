import sequelize from './connection';
import { DATE, STRING, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('order_slots', {
	date: {
		type: DATE
	},
	time: {
		type: STRING
	},
	quantity: {
		type: INTEGER
	},
	created_on: {
		type: DATE
	}
}, {timestamps: false});