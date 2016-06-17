import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('user_credit_transactions', {
	user_id: {
		type: INTEGER
	},
	created_on: {
		type: DATE
	},
	credit: {
		type: FLOAT
	},
	debit: {
		type: FLOAT
	},
	description: {
		type: STRING
	}
}, {timestamps: false});