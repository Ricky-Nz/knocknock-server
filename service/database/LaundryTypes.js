import sequelize from './connection';
import { STRING, DATE, ENUM, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('laundry_types', {
	laundry_type: {
		type: STRING
	},
	created_on: {
		type: DATE
	}
}, {timestamps: false});