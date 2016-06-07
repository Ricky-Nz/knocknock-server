import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// user_id			
// name			
// address			
// postal_code			
// apartment_type			
// district_id			
// note			
// created_on			
// unit_number			
// contact_no

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Address',
	  fields: {
	  	id: globalIdField('Address'),
			userId: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.user_id
			},
			postalCode: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.postal_code
			},
			address: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.address
			},
			contact: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.contact_no
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	}
}