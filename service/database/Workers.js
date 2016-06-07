import sequelize from './connection';
import { STRING, FLOAT, DOUBLE, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('workers', {
	first_name: {
		type: STRING
	},
	last_name: {
		type: STRING
	},
	points: {
		type: INTEGER
	},
	contact_no: {
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
	can_view_worker: {
		type: BOOLEAN
	},
	disabled: {
		type: BOOLEAN
	},
	note: {
		type: STRING
	},
	created_on: {
		type: DATE
	},
	email: {
		type: STRING
	},
	encrypted_password: {
		type: STRING
	},
	reset_password_token: {
		type: STRING
	},
	reset_password_sent_at: {
		type: DATE
	},
	color_hash: {
		type: STRING
	},
	location_updated_at: {
		type: DATE
	},
	latitude: {
		type: DOUBLE
	},
	longitude: {
		type: DOUBLE
	},
	last_known_location: {
		type: STRING
	},
	is_factory_worker: {
		type: BOOLEAN
	},
	factory_id: {
		type: INTEGER
	},
	sort_order: {
		type: INTEGER
	}
}, {timestamps: false});