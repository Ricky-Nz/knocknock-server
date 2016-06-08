import sequelize from './connection';
import { DATE, STRING, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('order_statuses', {
	status: {
		type: STRING,
		allowNull: false
	},
	stage: {
		type: INTEGER,
		allowNull: false
	}
}, {timestamps: false});