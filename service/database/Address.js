import sequelize from './connection';
import { STRING, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

const Address = sequelize.define('address', {
	userId: {
		type: STRING,
		allowNull: false
	},
	migrateUserId: {
		type: STRING
	},
	postalCode: {
		type: STRING,
		allowNull: false
	},
	address: {
		type: STRING,
		allowNull: false
	},
	contact: {
		type: STRING,
		allowNull: false
	}
});

export default Address;