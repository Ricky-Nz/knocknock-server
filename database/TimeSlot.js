import sequelize from './connection';
import { STRING, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('timeslot', {
	start: {
		type: DATE,
		allowNull: false
	},
	end: {
		type: DATE,
		allowNull: false
	}
});