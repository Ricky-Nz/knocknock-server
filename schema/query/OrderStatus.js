import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// { id: 1, status: 'Pending Worker', stage: 0 },

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'OrderStatus',
	  fields: {
	  	id: globalIdField('OrderStatus'),
	  	status: {
	  		type: GraphQLString,
	  		resolve: (obj) => obj.status
	  	},
			stage: {
				type: GraphQLInt,
				resolve: (obj) => obj.stage
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}