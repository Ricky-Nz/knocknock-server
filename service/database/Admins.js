import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';
import bcrypt from 'bcrypt';

export default sequelize.define('admins', {
	first_name: {
		type: STRING
	},
	last_name: {
		type: STRING
	},
	address: {
		type: STRING
	},
	postal_code: {
		type: STRING
	},
	contact_no: {
		type: STRING
	},
	created_on: {
		type: DATE
	},
	email: {
		type: STRING,
		allowNull: false
	},
	encrypted_password: {
		type: STRING
	},
	reset_password_token: {
		type: STRING
	},
	reset_password_sent_at: {
		type: DATE
	}
}, {
	timestamps: false,
	hooks: {
		beforeCreate: (admin, options) => {
			admin.encrypted_password = bcrypt.hashSync(admin.encrypted_password, 10);
		},
		beforeUpdate: (admin, options) => {
			if (admin.encrypted_password) {
				admin.encrypted_password = bcrypt.hashSync(admin.encrypted_password, 10);
			}
		}
	}
});