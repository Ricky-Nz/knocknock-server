import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('factories', {
	name: {
		type: STRING,
		allowNull: false
	},
	address: {
		type: STRING
	},
	postal_code: {
		type: STRING,
		allowNull: false
	},
	contact_no: {
		type: STRING,
		allowNull: false
	},
	contact_name: {
		type: STRING,
		allowNull: false
	},
	profile_image_url_small: {
		type: STRING
	},
	profile_image_url_medium: {
		type: STRING
	},
	profile_image_url_big: {
		type: STRING
	},
	created_on: {
		type: DATE,
		allowNull: false
	}
}, {timestamps: false});