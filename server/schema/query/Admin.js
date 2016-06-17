import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

   // { id: 2,
   //   first_name: 'Soe',
   //   last_name: 'Thu',
   //   address: 'cooalsia',
   //   postal_code: '123456',
   //   contact_no: '12345678',
   //   created_on: Tue Jun 30 2015 10:18:36 GMT+0800 (SGT),
   //   email: 'soe@coolasia.net',
   //   encrypted_password: '$2a$10$i5CGydZkvB6GfQ39XZXnWOZ8skSlYCmUgows4PFlyxrO8IH5I6qFS',
   //   reset_password_token: null,
   //   reset_password_sent_at: null },

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Admin',
	  fields: {
	  	id: globalIdField('Admin'),
			email: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.email
			},
			firstName: {
				type: GraphQLString,
				resolve: (obj) => obj.first_name
			},
			lastName: {
				type: GraphQLString,
				resolve: (obj) => obj.last_name
			},
			contact: {
				type: GraphQLString,
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