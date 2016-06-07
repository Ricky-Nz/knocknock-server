import sequelize from './connection';
import { STRING, DATE, ENUM, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('order_details', {
	order_id: {
		type: INTEGER
	},
	item_id: {
		type: INTEGER
	},
	quantity: {
		type: INTEGER
	},
	laundry_type: {
		type: STRING
	},
	price: {
		type: FLOAT
	}
}, {timestamps: false});