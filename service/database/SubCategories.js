import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('sub_categories', {
	category_id: {
		type: INTEGER
	},
	name_en: {
		type: STRING
	},
	name_ch: {
		type: STRING
	},
	items_count: {
		type: INTEGER
	},
	created_on: {
		type: DATE
	},
	image_url: {
		type: STRING
	},
	item_order: {
		type: INTEGER
	}
}, {timestamps: false});