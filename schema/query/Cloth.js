import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, toGlobalId } from 'graphql-relay';
import { formatPrice } from '../utils';

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
				resolve: (obj) => toGlobalId('Category', obj.sub_category_id)
			},
			nameEn: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.name_en
			},
			nameCn: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.name_ch
			},
			washPrice: {
				type: GraphQLFloat,
				resolve: (obj) => obj.wash_iron_price
			},
			dryCleanPrice: {
				type: GraphQLFloat,
				resolve: (obj) => obj.dry_clean_price
			},
			ironPrice: {
				type: GraphQLFloat,
				resolve: (obj) => obj.iron_price
			},
			discountWashPrice: {
				type: GraphQLFloat,
				resolve: (obj) => obj.discount_wash_iron_price
			},
			discountDryCleanPrice: {
				type: GraphQLFloat,
				resolve: (obj) => obj.discount_dry_clean_price
			},
			discountIronPrice: {
				type: GraphQLFloat,
				resolve: (obj) => obj.discount_iron_price
			},
			enableWashPriceDiscount: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.have_discount_wash_iron_price
			},
			enableDryCleanPriceDiscount: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.have_discount_dry_clean_price
			},
			enableIronPriceDiscount: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.have_discount_iron_price
			},
			special: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.special_item
			},
			hideFromUser: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.hide_from_user
			},
			enabled: {
				type: GraphQLBoolean,
				resolve: (obj) => !obj.disabled
			},
			imageUrl: {
				type: GraphQLString,
				resolve: (obj) => obj.image_url
			},

			name: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: (obj) => obj.name_en
			},
			wash: {
				type: GraphQLString,
				resolve: (obj) => isNaN(obj.wash_iron_price)?null:formatPrice(obj.wash_iron_price)
			},
			dry: {
				type: GraphQLString,
				resolve: (obj) => isNaN(obj.dry_clean_price)?null:formatPrice(obj.dry_clean_price)
			},
			iron: {
				type: GraphQLString,
				resolve: (obj) => isNaN(obj.iron_price)?null:formatPrice(obj.iron_price)
			},
			washD: {
				type: GraphQLString,
				resolve: (obj) => obj.have_discount_wash_iron_price?toPrice(obj.discount_wash_iron_price):null
			},
			dryD: {
				type: GraphQLString,
				resolve: (obj) => obj.have_discount_dry_clean_price?toPrice(obj.discount_dry_clean_price):null
			},
			ironD: {
				type: GraphQLString,
				resolve: (obj) => obj.have_discount_iron_price?toPrice(obj.discount_iron_price):null
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}