import sequelize from './connection';
import { STRING, FLOAT, DOUBLE, DATE, BOOLEAN, INTEGER } from 'sequelize';
import bcrypt from 'bcrypt';

export default sequelize.define('workers', {
	first_name: {
		type: STRING
	},
	last_name: {
		type: STRING
	},
	points: {
		type: INTEGER
	},
	contact_no: {
		type: STRING
	},
	profile_image_url_small: {
		type: STRING
	},
	profile_image_url_medium: {
		type: STRING
	},
	profile_image_url_big: {
		type: STRING
	},
	can_view_worker: {
		type: BOOLEAN,
		allowNull: false
	},
	disabled: {
		type: BOOLEAN
	},
	note: {
		type: STRING
	},
	created_on: {
		type: DATE,
		allowNull: false
	},
	email: {
		type: STRING,
		allowNull: false
	},
	encrypted_password: {
		type: STRING,
		allowNull: false
	},
	reset_password_token: {
		type: STRING
	},
	reset_password_sent_at: {
		type: DATE
	},
	color_hash: {
		type: STRING
	},
	location_updated_at: {
		type: DATE
	},
	latitude: {
		type: DOUBLE
	},
	longitude: {
		type: DOUBLE
	},
	last_known_location: {
		type: STRING
	},
	is_factory_worker: {
		type: BOOLEAN,
		allowNull: false
	},
	factory_id: {
		type: INTEGER
	},
	sort_order: {
		type: INTEGER
	}
}, {
	timestamps: false,
	hooks: {
		beforeCreate: (worker, options) => {
			worker.encrypted_password = bcrypt.hashSync(worker.encrypted_password, 10);
		},
		beforeUpdate: (worker, options) => {
			if (worker.encrypted_password) {
				worker.encrypted_password = bcrypt.hashSync(worker.encrypted_password, 10);
			}
		}
	}
});
