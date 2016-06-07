import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// sub_category_id			
// name_en			
// name_ch			
// wash_iron_price			
// dry_clean_price			
// iron_price			
// discount_wash_iron_price			
// discount_dry_clean_price			
// discount_iron_price			
// have_discount_dry_clean_price			
// have_discount_wash_iron_price			
// have_discount_iron_price			
// image_url			
// created_on			
// disabled			
// item_order			
// special_item			
// hide_from_user			
// description

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
				type: new GraphQLNonNull(GraphQLFloat),
				reslove: (obj) => obj.wash_iron_price
			},
			dryCleanPrice: {
				type: new GraphQLNonNull(GraphQLFloat),
				reslove: (obj) => obj.dry_clean_price
			},
			ironPrice: {
				type: new GraphQLNonNull(GraphQLFloat),
				reslove: (obj) => obj.iron_price
			},
			washPriceDiscount: {
				type: new GraphQLNonNull(GraphQLFloat),
				reslove: (obj) => obj.discount_wash_iron_price
			},
			dryCleanPriceDiscount: {
				type: new GraphQLNonNull(GraphQLFloat),
				reslove: (obj) => obj.discount_dry_clean_price
			},
			ironPriceDiscount: {
				type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
				reslove: (obj) => obj.discount_iron_price
			},
			special: {
				type: GraphQLBoolean,
				reslove: (obj) => obj.special_item
			},
			imageUrl: {
				type: new GraphQLNonNull(GraphQLString),
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