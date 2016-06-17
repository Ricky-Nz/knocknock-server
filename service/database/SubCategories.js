import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('sub_categories', {
	category_id: {
		type: INTEGER
	},
	name_en: {
		type: STRING,
		allowNull: false
	},
	name_ch: {
		type: STRING,
		allowNull: false
	},
	items_count: {
		type: INTEGER
	},
	created_on: {
		type: DATE,
		allowNull: false
	},
	image_url: {
		type: STRING
	},
	item_order: {
		type: INTEGER
	}
}, {timestamps: false});