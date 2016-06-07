import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('factories', {
	name: {
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
	contact_name: {
		type: STRING
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
		type: DATE
	}
}, {timestamps: false});