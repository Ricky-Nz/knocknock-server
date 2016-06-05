import sequelize from './connection';
import { STRING, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('timeslottemplate', {
	start: {
		type: INTEGER,
		allowNull: false
	},
	end: {
		type: INTEGER,
		allowNull: false
	},
	limit: {
		type: INTEGER,
		allowNull: false
	}
});