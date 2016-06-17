import sequelize from './connection';
import { STRING, ENUM, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('order_transactions', {
	user_id: {
		type: INTEGER
	},
	order_ids: {
		type: STRING
	},
	voucher_ids: {
		type: STRING
	},
	promo_code_id: {
		type: INTEGER
	},
	total_promo_discount: {
		type: FLOAT
	},
	original_amount: {
		type: FLOAT
	},
	payable_amount: {
		type: FLOAT
	},
	payment_mode: {
		type: STRING
	},
	payment_ref_token: {
		type: STRING
	},
	created_at: {
		type: DATE
	},
	total_voucher_amount: {
		type: FLOAT
	}
}, {timestamps: false});