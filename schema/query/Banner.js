import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// banner_name			
// banner_title			
// banner_description			
// banner_link			
// start_date			
// end_date			
// is_enabled			
// created			
// created_by			
// updated			
// updated_by			
// banner_image_url			
// banner_order			
// banner_section

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