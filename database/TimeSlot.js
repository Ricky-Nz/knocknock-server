import sequelize from './connection';
import { STRING, BOOLEAN } from 'sequelize';

export default sequelize.define('timeslot', {
	start: {
		type: STRING,
		allowNull: false
	},
	end: {
		type: STRING,
		allowNull: false
	},
	enabled: {
		type: BOOLEAN,
		defaultValue: false
	}
});