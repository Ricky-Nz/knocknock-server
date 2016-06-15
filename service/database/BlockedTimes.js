import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('blocked_times', {
	blocked_date_id: {
		type: INTEGER
	},
	start_time: {
		type: STRING
	},
	end_time: {
		type: STRING
	},
	created_on: {
		type: DATE
	},
	blocked_fullday: {
		type: BOOLEAN
	}
}, {timestamps: false});