import sequelize from './connection';
import { DATE, STRING, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('timeslot', {
	date: {
		type: DATE,
		allowNull: false
	},
	start: {
		type: STRING,
		allowNull: false
	},
	end: {
		type: STRING,
		allowNull: false
	},
	limit: {
		type: INTEGER,
		allowNull: false
	},
	enabled: {
		type: BOOLEAN,
		defaultValue: true
	}
});