import { GraphQLNonNull, GraphQLString, GraphQLFloat,
	GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import { DBLaundryCloth } from '../../database';
import { GraphQLLaundryClothEdge } from '../query/GraphQLLaundryCloth';
import GraphQLViewer from '../query/GraphQLViewer';

export default mutationWithClientMutationId({
	name: 'CreateLaundryCloth',
	inputFields: {
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
	},
	outputFields: {
		laundryClothEdge: {
			type: GraphQLLaundryClothEdge,
			resolve: (newCloth) => ({
				cursor: null,
				node: newCloth
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => DBLaundryCloth.create(args)
});

