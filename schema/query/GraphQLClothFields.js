import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

export default {
	id: globalIdField('Cloth'),
	nameEn: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'english name'
	},
	nameCn: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'chinese name'
	},
	washPrice: {
		type: new GraphQLNonNull(GraphQLFloat),
		description: 'normal wash price'
	},
	dryCleanPrice: {
		type: new GraphQLNonNull(GraphQLFloat),
		description: 'dry clean price'
	},
	ironPrice: {
		type: new GraphQLNonNull(GraphQLFloat),
		description: 'iron clean price'
	},
	washPriceDiscount: {
		type: GraphQLFloat,
		description: 'normal wash price discount'
	},
	dryCleanPriceDiscount: {
		type: GraphQLFloat,
		description: 'dry clean price discount'
	},
	ironPriceDiscount: {
		type: GraphQLFloat,
		description: 'iron clean price discount'
	},
	special: {
		type: GraphQLBoolean,
		description: 'special item'
	},
	imageUrl: {
		type: GraphQLString,
		description: 'cloth image url'
	}
}