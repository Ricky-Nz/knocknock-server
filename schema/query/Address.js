import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField, toGlobalId } from 'graphql-relay';

   // { id: 53,
   //   user_id: 130,
   //   name: 'Home',
   //   address: 'Block 818, Tampines Street 81, #03-604',
   //   postal_code: '520818',
   //   apartment_type: 'hdb',
   //   district_id: 53,
   //   note: '',
   //   created_on: Tue Jun 30 2015 10:18:37 GMT+0800 (SGT),
   //   unit_number: null,
   //   contact_no: null },

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Address',
	  fields: {
	  	id: globalIdField('Address'),
			userId: {
				type: GraphQLString,
				resolve: (obj) => toGlobalId('User', obj.user_id)
			},
			postalCode: {
				type: GraphQLString,
				resolve: (obj) => obj.postal_code
			},
			address: {
				type: GraphQLString,
				resolve: (obj) => obj.address
			},
			unitNumber: {
				type: GraphQLString,
				resolve: (obj) => obj.unit_number
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