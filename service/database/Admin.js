import sequelize from './connection';
import { STRING, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('admin', {
	email: {
		type: STRING,
		allowNull: false,
		isEmail: true
	},
	password: {
		type: STRING,
		allowNull: false
	},
	name: {
		type: STRING,
		allowNull: false
	},
	contact: {
		type: STRING
	}
});