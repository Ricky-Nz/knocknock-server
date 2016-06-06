import sequelize from './connection';
import { STRING, ENUM, DATE, INTEGER, BOOLEAN, FLOAT } from 'sequelize';

export default sequelize.define('promocode', {
	code: {
		type: STRING,
		allowNull: false
	},
	name: {
		type: STRING,
		allowNull: false
	},
	description: {
		type: STRING
	},
	start: {
		type: DATE,
		allowNull: false
	},
	end: {
		type: DATE,
		allowNull: false
	},
	perUserLimit: {
		type: INTEGER,
		allowNull: false
	},
	limit: {
		type: INTEGER,
		allowNull: false
	},
	promoType: {
		type: ENUM,
		values: ['flat', 'discount'],
		allowNull: false
	},
	promoValue: {
		type: INTEGER,
		allowNull: false
	},
	amount: {
		type: INTEGER,
		allowNull: false
	},
	multipleUse: {
		type: BOOLEAN,
		defaultValue: false
	},
	mobileOnly: {
		type: BOOLEAN,
		defaultValue: false
	},
	firstTimeUser: {
		type: BOOLEAN,
		defaultValue: false
	},
	enabled: {
		type: BOOLEAN,
		defaultValue: true
	}
});

