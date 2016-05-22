import sequelize from './connection';
import { STRING, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

const LaundryCloth = sequelize.define('clothcategory', {
	nameEn: {
		type: STRING,
		allowNull: false
	},
	nameCn: {
		type: STRING,
		allowNull: false
	},
	count: {
		type: INTEGER,
		defaultValue: 0
	}
});

export default LaundryCloth;