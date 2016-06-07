import sequelize from './connection';
import { STRING, FLOAT, DATE, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('items', {
	sub_category_id: {
		type: INTEGER
	},
	name_en: {
		type: STRING
	},
	name_ch: {
		type: STRING
	},
	wash_iron_price: {
		type: FLOAT
	},
	dry_clean_price: {
		type: FLOAT
	},
	iron_price: {
		type: FLOAT
	},
	discount_wash_iron_price: {
		type: FLOAT
	},
	discount_dry_clean_price: {
		type: FLOAT
	},
	discount_iron_price: {
		type: FLOAT
	},
	have_discount_dry_clean_price: {
		type: BOOLEAN
	},
	have_discount_wash_iron_price: {
		type: BOOLEAN
	},
	have_discount_iron_price: {
		type: BOOLEAN
	},
	image_url: {
		type: STRING
	},
	created_on: {
		type: STRING
	},
	disabled: {
		type: DATE
	},
	item_order: {
		type: INTEGER
	},
	special_item: {
		type: BOOLEAN
	},
	hide_from_user: {
		type: BOOLEAN
	},
	description: {
		type: STRING
	}
}, {timestamps: false});