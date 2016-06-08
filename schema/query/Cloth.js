import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

   // { id: 18,
   //   sub_category_id: 3,
   //   name_en: 'Cheongsam',
   //   name_ch: '旗袍',
   //   wash_iron_price: null,
   //   dry_clean_price: '15.90',
   //   iron_price: null,
   //   discount_wash_iron_price: '1.00',
   //   discount_dry_clean_price: '12.90',
   //   discount_iron_price: '1.00',
   //   have_discount_dry_clean_price: true,
   //   have_discount_wash_iron_price: null,
   //   have_discount_iron_price: null,
   //   image_url: 'https://s3-ap-southeast-1.amazonaws.com/knocknock%2Fitems/6845eb6c0775d50c2d6612d94a098900_1458635809.jpg',
   //   created_on: Tue Jun 30 2015 10:18:36 GMT+0800 (SGT),
   //   disabled: false,
   //   item_order: 77,
   //   special_item: false,
   //   hide_from_user: false,
   //   description: '' },

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Cloth',
	  fields: {
	  	id: globalIdField('Cloth'),
			categoryId: {
				type: new GraphQLNonNull(GraphQLString),
				reslove: (obj) => obj.sub_category_id
			},
			nameEn: {
				type: new GraphQLNonNull(GraphQLString),
				reslove: (obj) => obj.name_en
			},
			nameCn: {
				type: new GraphQLNonNull(GraphQLString),
				reslove: (obj) => obj.name_ch
			},
			washPrice: {
				type: GraphQLFloat,
				reslove: (obj) => obj.wash_iron_price
			},
			dryCleanPrice: {
				type: GraphQLFloat,
				reslove: (obj) => obj.dry_clean_price
			},
			ironPrice: {
				type: GraphQLFloat,
				reslove: (obj) => obj.iron_price
			},
			washPriceDiscount: {
				type: GraphQLFloat,
				reslove: (obj) => obj.discount_wash_iron_price
			},
			dryCleanPriceDiscount: {
				type: GraphQLFloat,
				reslove: (obj) => obj.discount_dry_clean_price
			},
			ironPriceDiscount: {
				type: GraphQLFloat,
				reslove: (obj) => obj.discount_iron_price
			},
			special: {
				type: GraphQLBoolean,
				reslove: (obj) => obj.special_item
			},
			imageUrl: {
				type: GraphQLString,
				reslove: (obj) => obj.image_url
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}