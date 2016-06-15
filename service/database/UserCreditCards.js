import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('user_credit_cards', {
	user_id: {
		type: INTEGER
	},
	stripe_card_id: {
		type: STRING
	},
	brand: {
		type: STRING
	},
	country: {
		type: STRING
	},
	cvc_check: {
		type: STRING
	},
	dynamic_last4: {
		type: STRING
	},
	exp_month: {
		type: INTEGER
	},
	exp_year: {
		type: INTEGER
	},
	funding: {
		type: STRING
	},
	last4: {
		type: STRING
	},
	name: {
		type: STRING
	},
	tokenization_method: {
		type: STRING
	},
	fingerprint: {
		type: STRING
	},
	first6: {
		type: STRING
	}
}, {timestamps: false});