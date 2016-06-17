import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

  // { id: 25198,
  //   date: Wed Aug 19 2015 08:00:00 GMT+0800 (SGT),
  //   time: '19:00',
  //   quantity: 0,
  //   created_on: Sat Aug 15 2015 00:32:59 GMT+0800 (SGT) },

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
			},
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