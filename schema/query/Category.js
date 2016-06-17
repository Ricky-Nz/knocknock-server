import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

   // { id: 6,
   //   category_id: 2,
   //   name_en: 'Curtain',
   //   name_ch: '窗帘',
   //   items_count: 7,
   //   created_on: Tue Jun 30 2015 10:18:36 GMT+0800 (SGT),
   //   image_url: 'https://s3-ap-southeast-1.amazonaws.com/knocknock%2Fsubcategories/6439bc5f8000f6038dbd95d6c677c25a_1457693058.png',
   //   item_order: 4 },

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