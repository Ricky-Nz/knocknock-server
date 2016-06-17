import sequelize from './connection';
import { DATE, STRING, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('order_slots', {
	date: {
		type: DATE,
		allowNull: false
	},
	time: {
		type: STRING,
		allowNull: false
	},
	quantity: {
		type: INTEGER,
		allowNull: false
	},
	created_on: {
		type: DATE
	}
}, {timestamps: false});