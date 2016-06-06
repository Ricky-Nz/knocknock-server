import sequelize from './connection';
import { STRING, ENUM, BOOLEAN, INTEGER } from 'sequelize';

const Record = sequelize.define('permission', {
	type: {
		type: ENUM,
		values: ['CREATE', 'UPDATE', 'EXECUTE'],
		allowNull: false
	},
	scope: {
		type: ENUM,
		values: ['User', 'LaundryOrder'],
		allowNull: false
	},
	targetId: {
		type: INTEGER,
		allowNull: false
	},
	field: {
		type: STRING,
		allowNull: false
	},
	before: {
		type: STRING
	},
	after: {
		type: STRING
	},
	description: {
		type: STRING
	}
});

export default Record;