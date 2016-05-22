import sequelize from './connection';
import { STRING, FLOAT, BOOLEAN, INTEGER } from 'sequelize';
import ClothCategory from './clothCategory';

function updateCategoryCount(instance, fn) {
	LaundryCloth.count()
		.then(count => ClothCategory.update({count}, {where: {id: instance.categoryId}}))
		.then(() => fn())
		.catch(() => fn());
}

const LaundryCloth = sequelize.define('cloth', {
	categoryId: {
		type: STRING,
		allowNull: false
	},
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
}, {
	hooks: {
		afterCreate: (instance, options, fn) => {
			updateCategoryCount(instance, fn);
		},
		afterDestroy: (instance, options, fn) => {
			updateCategoryCount(instance, fn);
		}
	}
});

export default LaundryCloth;