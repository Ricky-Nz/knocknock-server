import { GraphQLObjectType, GraphQLEnumType, GraphQLFloat,
	GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { connectionDefinitions, globalIdField, fromGlobalId } from 'graphql-relay';
import { nodeInterface } from './nodeDefinition';

export const GraphQLLaundryCloth = new GraphQLObjectType({
	name: 'LaundryCloth',
	description: 'launtry cloth',
	fields: {
		id: globalIdField('LaundryCloth'),
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
			type: new GraphQLNonNull(GraphQLString),
			description: 'cloth image url'
		}
	},
	interfaces: [nodeInterface]
});

const { connectionType, edgeType } = connectionDefinitions({
	nodeType: GraphQLLaundryCloth
});

export const GraphQLLaundryClothEdge = edgeType;

export const GraphQLLaundryClothConnection = connectionType;