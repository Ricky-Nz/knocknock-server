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
			displayTime: {
				type: GraphQLString,
				resolve: (obj) => obj.displayTime
			},
			hour: {
				type: GraphQLInt,
				resolve: (obj) => obj.hour
			},
			enabled: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.enabled
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}