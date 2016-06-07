import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// category_id			
// name_en			
// name_ch			
// items_count			
// created_on			
// image_url			
// item_order

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Category',
	  fields: {
	  	id: globalIdField('Category'),
			nameCn: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.name_ch
			},
			nameEn: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.name_en
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}