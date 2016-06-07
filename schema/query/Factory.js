import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// name			
// address			
// postal_code			
// contact_no			
// contact_name			
// profile_image_url_small			
// profile_image_url_medium			
// profile_image_url_big			
// created_on

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Factory',
	  fields: {
	  	id: globalIdField('Factory'),
			name: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.name
			},
			address: {
				type: GraphQLString,
				resolve: (obj) => obj.address
			},
			postalCode: {
				type: GraphQLString,
				resolve: (obj) => obj.postal_code
			},
			contact: {
				type: GraphQLString,
				resolve: (obj) => obj.contact_no
			},
			contactName: {
				type: GraphQLString,
				resolve: (obj) => obj.contact_name
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}