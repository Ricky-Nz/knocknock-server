import sequelize from './connection';
import { STRING, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

const LaundryCloth = sequelize.define('laundrycloth', {
	nameEn: {
		type: STRING,
		allowNull: false
	},
	nameCn: {
		type: STRING,
		allowNull: false
	},
	washPrice: {
		type: FLOAT,
		allowNull: false
	},
	dryCleanPrice: {
		type: FLOAT,
		allowNull: false
	},
	ironPrice: {
		type: FLOAT,
		allowNull: false
	},
	washPriceDiscount: {
		type: FLOAT,
		defaultValue: 1.0
	},
	dryCleanPriceDiscount: {
		type: FLOAT,
		defaultValue: 1.0
	},
	ironPriceDiscount: {
		type: FLOAT,
		defaultValue: 1.0
	},
	special: {
		type: BOOLEAN,
		defaultValue: false
	},
	imageUrl: {
		type: STRING,
		allowNull: false
	},
	imageBucket: {
		type: STRING,
		allowNull: false
	},
	imageId: {
		type: STRING,
		allowNull: false
	}
});

export default LaundryCloth;