import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('admins', {
	first_name: {
		type: STRING
	},
	last_name: {
		type: STRING
	},
	address: {
		type: STRING
	},
	postal_code: {
		type: STRING
	},
	contact_no: {
		type: STRING
	},
	created_on: {
		type: DATE
	},
	email: {
		type: STRING,
		allowNull: false
	},
	encrypted_password: {
		type: STRING
	},
	reset_password_token: {
		type: STRING
	},
	reset_password_sent_at: {
		type: DATE
	}
}, {timestamps: false});