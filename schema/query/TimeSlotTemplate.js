import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// district_id			
// time			
// max_pickup			
// updated			
// created			
// max_dropoff			
// current_pickup			
// current_dropoff

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