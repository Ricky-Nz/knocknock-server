import sequelize from './connection';
import { STRING, BOOLEAN, DATE, INTEGER } from 'sequelize';

export default sequelize.define('district_timeslots', {
	district_id: {
		type: INTEGER
	},
	date: {
		type: DATE
	},
	time: {
		type: STRING
	},
	max_pickup: {
		type: INTEGER
	},
	created_on: {
		type: DATE
	},
	max_dropoff: {
		type: INTEGER
	},
	current_pickup: {
		type: INTEGER
	},
	current_dropoff: {
		type: INTEGER
	}
}, {timestamps: false});