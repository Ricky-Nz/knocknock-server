import sequelize from './connection';
import { STRING, DATE, ENUM, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('orders', {
	pickup_worker_id: {
		type: INTEGER
	},
	drop_off_worker_id: {
		type: INTEGER
	},
	user_id: {
		type: INTEGER
	},
	order_status_id: {
		type: INTEGER
	},
	drop_off_district_id: {
		type: INTEGER
	},
	pickup_district_id: {
		type: INTEGER
	},
	factory_id: {
		type: INTEGER
	},
	description: {
		type: STRING
	},
	lazy_order: {
		type: BOOLEAN
	},
	express_order: {
		type: BOOLEAN
	},
	total_price: {
		type: FLOAT
	},
	pickup_address: {
		type: STRING
	},
	pickup_postal_code: {
		type: STRING
	},
	pickup_apartment_type: {
		type: STRING
	},
	drop_off_address: {
		type: STRING
	},
	drop_off_postal_code: {
		type: STRING
	},
	drop_off_apartment_type: {
		type: STRING
	},
	speed_rating: {
		type: INTEGER
	},
	attitude_rating: {
		type: INTEGER
	},
	created_on: {
		type: DATE,
		allowNull: false
	},
	pickup_date: {
		type: DATE,
		allowNull: false
	},
	pickup_time: {
		type: STRING,
		allowNull: false
	},
	drop_off_date: {
		type: DATE
	},
	drop_off_time: {
		type: STRING
	},
	review: {
		type: STRING
	},
	pickup_changed: {
		type: BOOLEAN
	},
	deliver_changed: {
		type: BOOLEAN
	},
	paypal_ref_no: {
		type: STRING
	},
	paid: {
		type: BOOLEAN,
		defaultValue: false
	},
	pay_later: {
		type: BOOLEAN
	},
	payment_mode: {
		type: STRING
	},
	to_pay_price: {
		type: FLOAT
	},
	voucher_id: {
		type: INTEGER
	},
	free: {
		type: BOOLEAN
	},
	worker_checked: {
		type: BOOLEAN
	},
	user_checked: {
		type: BOOLEAN
	},
	order_source_id: {
		type: INTEGER
	},
	qr_code_url: {
		type: STRING
	},
	factory_worker_id: {
		type: INTEGER
	},
	factory_received_date: {
		type: DATE
	},
	factory_completed_date: {
		type: DATE
	},
	is_merged: {
		type: BOOLEAN
	},
	signature_url: {
		type: STRING
	},
	merged_order_ids: {
		type: STRING
	},
	is_imported: {
		type: BOOLEAN
	},
	is_mergable: {
		type: BOOLEAN
	},
	order_number: {
		type: STRING
	},
	pickup_contact_no: {
		type: STRING
	},
	drop_off_contact_no: {
		type: STRING
	},
	recurring_order_id: {
		type: INTEGER
	},
	promo_code_id: {
		type: INTEGER
	},
	promo_discount: {
		type: FLOAT
	},
	voucher_discount: {
		type: FLOAT
	},
	pickup_time_end: {
		type: STRING
	},
	drop_off_time_end: {
		type: STRING
	},
	pickup_unit_number: {
		type: STRING
	},
	drop_off_unit_number: {
		type: STRING
	},
	drop_off_description: {
		type: STRING
	},
	pickup_address_name: {
		type: STRING
	},
	drop_off_address_name: {
		type: STRING
	}
}, {timestamps: false});