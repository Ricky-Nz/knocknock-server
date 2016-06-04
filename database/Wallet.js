import sequelize from './connection';
import { STRING, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('wallet', {
	userId: {
		type: STRING,
		allowNull: false,
		unique: true
	},
	credit: {
		type: INTEGER,
		defaultValue: false
	},
	freeze: {
		type: BOOLEAN,
		defaultValue: false
	}
});