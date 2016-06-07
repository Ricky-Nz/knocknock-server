import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// date			
// time			
// quantity			
// created_on

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'TimeSlot',
	  fields: {
	  	id: globalIdField('TimeSlot'),
			date: {
				type: GraphQLString,
				resolve: (obj) => obj.date
			},
			time: {
				type: GraphQLString,
				resolve: (obj) => obj.time
			}
			quantity: {
				type: GraphQLInt,
				resolve: (obj) => obj.quantity
			},
			enabled: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.quantity > 0
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}