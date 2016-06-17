import sequelize from './connection';
import { STRING, ENUM, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('permissions', {
	name: {
		type: STRING
	},
	controller: {
		type: STRING
	},
	action: {
		type: STRING
	},
	remarks: {
		type: STRING
	},
	is_active: {
		type: BOOLEAN
	},
	created: {
		type: DATE
	},
	created_by: {
		type: STRING
	},
	updated: {
		type: DATE
	},
	updated_by: {
		type: STRING
	},
	group: {
		type: STRING
	}
}, {timestamps: false});