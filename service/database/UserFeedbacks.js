import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('user_feedbacks', {
	user_id: {
		type: INTEGER
	},
	rating: {
		type: FLOAT
	},
	comment: {
		type: STRING
	},
	created: {
		type: DATE
	}
}, {timestamps: false});