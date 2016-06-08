import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

   // { id: 3,
   //   banner_name: '1',
   //   banner_title: '1',
   //   banner_description: null,
   //   banner_link: 'http://knocknockapp.com/',
   //   start_date: Tue May 17 2016 00:00:00 GMT+0800 (SGT),
   //   end_date: Fri Jun 10 2016 00:00:00 GMT+0800 (SGT),
   //   is_enabled: null,
   //   created: Wed May 18 2016 13:28:10 GMT+0800 (SGT),
   //   created_by: 'Admin zhang',
   //   updated: Mon May 23 2016 11:34:57 GMT+0800 (SGT),
   //   updated_by: 'Admin zhang',
   //   banner_image_url: 'https://s3-ap-southeast-1.amazonaws.com/knocknock%2Fpromobanners/c4ca4238a0b923820dcc509a6f75849b_1463578339.png',
   //   banner_order: null,
   //   banner_section: 0 },

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Banner',
	  fields: {
	  	id: globalIdField('Banner'),
			enabled: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.is_enabled
			},
			title: {
				type: GraphQLString,
				resolve: (obj) => obj.banner_title
			},
			link: {
				type: GraphQLString,
				resolve: (obj) => obj.banner_link
			},
			position: {
				type: GraphQLInt,
				resolve: (obj) => obj.banner_order
			},
			imageUrl: {
				type: GraphQLString,
				resolve: (obj) => obj.banner_image_url
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}