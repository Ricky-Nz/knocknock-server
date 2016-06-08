import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER, ENUM } from 'sequelize';

export default sequelize.define('promotion_banners', {
	banner_name: {
		type: STRING
	},
	banner_title: {
		type: STRING
	},
	banner_description: {
		type: STRING
	},
	banner_link: {
		type: STRING
	},
	start_date: {
		type: DATE
	},
	end_date: {
		type: DATE
	},
	is_enabled: {
		type: BOOLEAN
	},
	created: {
		type: DATE
	},
	created_by: {
		type: STRING
	},
	updated: {
		type: DATE
	},
	updated_by: {
		type: STRING
	},
	banner_image_url: {
		type: STRING
	},
	banner_order: {
		type: INTEGER
	},
	banner_section: {
		type: INTEGER
	}
}, {timestamps: false});