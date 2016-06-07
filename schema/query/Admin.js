import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// first_name			
// last_name			
// address			
// postal_code			
// contact_no			
// created_on			
// email			
// encrypted_password			
// reset_password_token			
// reset_password_sent_at

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Admin',
	  fields: {
	  	id: globalIdField('Admin'),
			email: {
				type: new GraphQLNonNull(GraphQLString)
			},
			firstName: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.first_name
			},
			lastName: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.last_name
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