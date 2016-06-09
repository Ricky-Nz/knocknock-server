import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('user_credits', {
	user_id: {
		type: INTEGER
	},
	amount: {
		type: FLOAT
	},
	paypal_ref_no: {
		type: STRING
	},
	top_up: {
		type: BOOLEAN
	},
	created_on: {
		type: DATE
	},
	payment_mode: {
		type: STRING
	},
	status: {
		type: INTEGER
	},
	approved_on: {
		type: DATE
	},
	approved_by: {
		type: STRING
	},
	remarks: {
		type: STRING
	}
}, {timestamps: false});