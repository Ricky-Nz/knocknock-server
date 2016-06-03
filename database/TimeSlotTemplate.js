import sequelize from './connection';
import { STRING, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('timeslottemplate', {
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
	}
});