import sequelize from './connection';
import { STRING, DATE, ENUM, FLOAT, BOOLEAN, INTEGER } from 'sequelize';

export default sequelize.define('orderitem', {
	serialNumber: {
		type: STRING,
		allowNull: false
	},
	productId: {
		type: STRING,
		allowNull: false
	},
	washType: {
		type: ENUM,
		values: ['Wash&Iron', 'Dry Clean', 'Iron']
	},
	itemPrice: {
		type: INTEGER,
		allowNull: false
	},
	itemNameCn: {
		type: STRING,
		allowNull: false
	},
	itemNameEn: {
		type: STRING,
		allowNull: false
	},
	itemImageUrl: {
		type: STRING,
		allowNull: false
	},
	quantity: {
		type: INTEGER,
		allowNull: false
	}
});