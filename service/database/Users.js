import sequelize from './connection';
import { STRING, ENUM, DATE, INTEGER, BOOLEAN, FLOAT } from 'sequelize';

export default sequelize.define('users', {
	first_name: {
		type: STRING
	},
	last_name: {
		type: STRING
	},
	contact_no: {
		type: STRING
	},
	credit: {
		type: FLOAT
	},
	points: {
		type: INTEGER
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
	gender: {
		type: STRING
	},
	code: {
		type: STRING
	},
	age: {
		type: INTEGER
	},
	marital_status: {
		type: STRING
	},
	have_child: {
		type: BOOLEAN
	},
	have_maid: {
		type: BOOLEAN
	},
	occupation: {
		type: STRING
	},
	nationality: {
		type: STRING
	},
	orders_count: {
		type: INTEGER
	},
	rank: {
		type: INTEGER
	},
	disabled: {
		type: BOOLEAN
	},
	first_login: {
		type: BOOLEAN
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
	is_imported: {
		type: BOOLEAN
	},
	created_by: {
		type: STRING
	},
	verification_code: {
		type: STRING
	},
	is_verified: {
		type: BOOLEAN
	},
	birth_month: {
		type: INTEGER
	},
	birth_year: {
		type: INTEGER
	},
	adv_source: {
		type: STRING
	},
	referral_code: {
		type: STRING
	},
	verification_code_expiry: {
		type: DATE
	},
	stripe_customer_id: {
		type: STRING
	},
	android_app_version: {
		type: STRING
	},
	ios_app_version: {
		type: STRING
	},
	plus_account: {
		type: STRING
	}
}, {timestamps: false});
