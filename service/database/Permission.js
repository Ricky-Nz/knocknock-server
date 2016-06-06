import sequelize from './connection';
import { STRING, ENUM, BOOLEAN, INTEGER } from 'sequelize';

const Permission = sequelize.define('permission', {
	userId: {
		type: INTEGER,
		allowNull: false
	},
	worker: {
		type: ENUM,
		values: ['n', 'r', 'rw'],
		defaultValue: 'n'
	},
	client: {
		type: ENUM,
		values: ['n', 'r', 'rw'],
		defaultValue: 'n'
	},
	admin: {
		type: ENUM,
		values: ['n', 'r', 'rw'],
		defaultValue: 'n'
	},
	order: {
		type: ENUM,
		values: ['n', 'r', 'rw'],
		defaultValue: 'n'
	}
});

export default Permission;