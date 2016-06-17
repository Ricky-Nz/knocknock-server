import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

   // { id: 1,
   //   name: '林老板',
   //   address: '林老板',
   //   postal_code: '000000',
   //   contact_no: '000000',
   //   contact_name: '林',
   //   profile_image_url_small: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/factories/default_small.jpg',
   //   profile_image_url_medium: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/factories/default_medium.jpg',
   //   profile_image_url_big: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/factories/default_big.jpg',
   //   created_on: Tue Jun 30 2015 10:18:37 GMT+0800 (SGT) },

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