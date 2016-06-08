import sequelize from './connection';
import { STRING, ENUM, BOOLEAN, FLOAT, DATE } from 'sequelize';

export default sequelize.define('user_vouchers', {
	user_id: {
		type: STRING,
		allowNull: false
	},
	voucher_id: {
		type: STRING,
		allowNull: false
	},
	used: {
		type: BOOLEAN
	},
	created_on: {
		type: DATE,
		allowNull: false
	}
}, {timestamps: false});