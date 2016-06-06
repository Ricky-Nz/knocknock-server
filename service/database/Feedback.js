import sequelize from './connection';
import { STRING, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('feedback', {
	userId: {
		type: STRING,
		allowNull: false
	},
	rating: {
		type: FLOAT,
		allowNull: false
	},
	comment: {
		type: STRING
	},
	source: {
		type: STRING,
		allowNull: false
	}
});