import sequelize from './connection';
import { STRING, BOOLEAN, DATE, INTEGER } from 'sequelize';

export default sequelize.define('default_district_timeslots', {
	district_id: {
		type: INTEGER
	},
	time: {
		type: STRING
	},
	max_pickup: {
		type: INTEGER
	},
	updated: {
		type: DATE
	},
	created: {
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