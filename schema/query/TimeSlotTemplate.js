import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

  // { id: 194,
  //   district_id: 58,
  //   time: '13:00',
  //   max_pickup: 30,
  //   updated: Thu Oct 22 2015 15:27:36 GMT+0800 (SGT),
  //   created: Thu Oct 22 2015 15:27:36 GMT+0800 (SGT),
  //   max_dropoff: 30,
  //   current_pickup: 0,
  //   current_dropoff: 0 },

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'TimeSlotTemplate',
	  fields: {
	  	id: globalIdField('TimeSlotTemplate'),
			time: {
				type: GraphQLString,
				resolve: (obj) => obj.time
			},
			limit: {
				type: GraphQLInt,
				resolve: (obj) => obj.max_pickup
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}