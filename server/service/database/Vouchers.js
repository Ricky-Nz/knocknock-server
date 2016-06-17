import sequelize from './connection';
import { STRING, ENUM, BOOLEAN, FLOAT, DATE } from 'sequelize';

export default sequelize.define('vouchers', {
	title: {
		type: STRING
	},
	value: {
		type: FLOAT
	},
	expire_on: {
		type: DATE
	},
	created_on: {
		type: DATE
	},
	disabled: {
		type: BOOLEAN
	},
	seen: {
		type: BOOLEAN
	}
}, {timestamps: false});