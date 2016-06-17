import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

  // { id: 33,
  //   first_name: 'Victoria',
  //   last_name: 'Yvonne',
  //   points: 312,
  //   contact_no: '83395026',
  //   profile_image_url_small: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/users/default_small.jpg',
  //   profile_image_url_medium: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/users/default_medium.jpg',
  //   profile_image_url_big: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/users/default_big.jpg',
  //   can_view_worker: true,
  //   disabled: false,
  //   note: '',
  //   created_on: Tue Jun 30 2015 10:18:36 GMT+0800 (SGT),
  //   email: 'pt4@knocknockapp.com',
  //   encrypted_password: '$2a$10$mzLKBZNm3D1M5VM9UXNWwuSswcrFXtnOaBg4lQ/P7uYEIksBXpECy',
  //   reset_password_token: null,
  //   reset_password_sent_at: null,
  //   color_hash: '#7fdb23',
  //   location_updated_at: null,
  //   latitude: null,
  //   longitude: null,
  //   last_known_location: null,
  //   is_factory_worker: false,
  //   factory_id: null,
  //   sort_order: 0 } ]

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Worker',
	  fields: {
	  	id: globalIdField('Worker'),
	  	email: {
	  		type: GraphQLString,
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
			},
			enabled: {
				type: GraphQLBoolean,
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