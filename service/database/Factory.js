import sequelize from './connection';
import { STRING, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

const Factory = sequelize.define('factory', {
	name: {
		type: STRING,
		allowNull: false
	},
	address: {
		type: STRING,
		allowNull: false
	},
	postalCode: {
		type: STRING,
		allowNull: false
	},
	contact: {
		type: STRING,
		allowNull: false
	},
	contactName: {
		type: STRING,
		allowNull: false
	}
});

export default Factory;