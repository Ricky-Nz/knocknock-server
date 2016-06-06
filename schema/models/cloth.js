import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { DBCloth } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {

};

const mutableFields = (update) => ({
	categoryId: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'category ID'
	},
	nameEn: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'english name'
	},
	nameCn: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'chinese name'
	},
	washPrice: {
		type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
		description: 'normal wash price'
	},
	dryCleanPrice: {
		type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
		description: 'dry clean price'
	},
	ironPrice: {
		type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
		description: 'iron clean price'
	},
	washPriceDiscount: {
		type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
		description: 'normal wash price discount'
	},
	dryCleanPriceDiscount: {
		type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
		description: 'dry clean price discount'
	},
	ironPriceDiscount: {
		type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
		description: 'iron clean price discount'
	},
	special: {
		type: GraphQLBoolean,
		description: 'special item'
	}
});

export default {
	inputs: {
		...staticFields,
		...mutableFields()
	},
	updates: {
		...mutableFields(true)
	},
	fields: {
		...staticFields,
		...mutableFields(false, true),
		imageUrl: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'cloth image url'
		}
	},
	...DBCloth
};
