import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// first_name			
// last_name			
// points			
// contact_no			
// profile_image_url_small			
// profile_image_url_medium			
// profile_image_url_big			
// can_view_worker			
// disabled			
// note			
// created_on			
// email			
// encrypted_password			
// reset_password_token			
// reset_password_sent_at			
// color_hash			
// location_updated_at			
// latitude			
// longitude			
// last_known_location			
// is_factory_worker			
// factory_id			
// sort_order

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Worker',
	  fields: {
	  	id: globalIdField('Worker'),
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
			},
			enabled: {
				type: GraphQLString,
				resolve: (obj) => !obj.disabled
			},
			avatarUrl: {
				type: GraphQLString,
				resolve: (obj) => obj.profile_image_url_small
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}