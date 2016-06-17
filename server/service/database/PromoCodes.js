import sequelize from './connection';
import { STRING, ENUM, DATE, INTEGER, BOOLEAN, FLOAT } from 'sequelize';

export default sequelize.define('promo_codes', {
	name: {
		type: STRING
	},
	start_date: {
		type: DATE
	},
	end_date: {
		type: DATE
	},
	status: {
		type: INTEGER
	},
	limit: {
		type: INTEGER
	},
	allow_multiple_use: {
		type: BOOLEAN
	},
	only_app: {
		type: BOOLEAN
	},
	promo_type: {
		type: INTEGER
	},
	discount_percent: {
		type: FLOAT
	},
	flat_discount: {
		type: FLOAT
	},
	created_at: {
		type: DATE
	},
	created_by: {
		type: STRING
	},
	updated_at: {
		type: DATE
	},
	updated_by: {
		type: STRING
	},
	code: {
		type: STRING
	},
	remarks: {
		type: STRING
	},
	user_limit: {
		type: INTEGER
	},
	per_user_limit: {
		type: INTEGER
	},
	firsttime_user: {
		type: BOOLEAN
	}
}, {timestamps: false});

