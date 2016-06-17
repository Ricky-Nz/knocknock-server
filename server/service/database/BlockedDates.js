import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('blocked_dates', {
	date: {
		type: STRING
	},
	created_on: {
		type: DATE
	},
	district_code: {
		type: STRING
	},
	district_id: {
		type: INTEGER
	},
	block_fullday: {
		type: BOOLEAN
	},
	is_pickup: {
		type: BOOLEAN
	},
	is_dropoff: {
		type: BOOLEAN
	}
}, {timestamps: false});