import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('user_addresses', {
	user_id: {
		type: INTEGER
	},
	name: {
		type: STRING,
		allowNull: false
	},			
	address: {
		type: STRING
	},			
	postal_code: {
		type: STRING
	},			
	apartment_type: {
		type: STRING
	},
	district_id: {
		type: INTEGER
	},
	note: {
		type: STRING
	},
	created_on: {
		type: DATE
	},
	unit_number: {
		type: STRING
	},
	contact_no: {
		type: STRING
	}
}, {timestamps: false});