import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// title			
// value			
// expire_on			
// created_on			
// disabled			
// seen

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Factory',
	  fields: {
	  	id: globalIdField('Factory'),
			title: {
				type: GraphQLString,
				resolve: (obj) => obj.title
			},
			value: {
				type: GraphQLFloat,
				resolve: (obj) => obj.value
			},
			expireOn: {
				type: GraphQLString,
				resolve: (obj) => obj.expire_on
			},
			enabled: {
				type: GraphQLBoolean,
				resolve: (obj) => !obj.disabled
			},
			createdAt: {
				type: GraphQLString,
				resolve: (obj) => obj.created_on
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}