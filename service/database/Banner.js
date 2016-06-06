import sequelize from './connection';
import { STRING, FLOAT, BOOLEAN, INTEGER, ENUM } from 'sequelize';

export default sequelize.define('banner', {
	enabled: {
		type: BOOLEAN,
		defaultValue: false
	},
	title: {
		type: STRING,
		allowNull: false
	},
	link: {
		type: STRING
	},
	position: {
		type: INTEGER
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