import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// name			
// start_date			
// end_date			
// status			
// limit			
// allow_multiple_use			
// only_app			
// promo_type			
// discount_percent			
// flat_discount			
// created_at			
// created_by			
// updated_at			
// updated_by			
// code			
// remarks			
// user_limit			
// per_user_limit			
// firsttime_user

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'PromoCode',
	  fields: {
	  	id: globalIdField('PromoCode'),
			enabled: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.status === 'enabled'
			},
			name: {
				type: GraphQLString,
				resolve: (obj) => obj.name
			},
			description: {
				type: GraphQLString,
				resolve: (obj) => obj.remarks
			},
			start: {
				type: GraphQLString,
				resolve: (obj) => obj.start_date
			},
			end: {
				type: GraphQLString,
				resolve: (obj) => obj.end_date
			},
			perUserLimit: {
				type: GraphQLInt,
				resolve: (obj) => obj.per_user_limit
			},
			limit: {
				type: GraphQLInt,
				resolve: (obj) => obj.limit
			},
			promoType: {
				type: GraphQLString,
				resolve: (obj) => obj.promo_type
			},
			flatDiscount: {
				type: GraphQLFloat,
				resolve: (obj) => obj.flat_discount
			},
			discountPercent: {
				type: GraphQLFloat,
				resolve: (obj) => obj.discount_percent
			},
			multipleUse: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.allow_multiple_use
			},
			mobileOnly: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.only_app
			},
			firstTimeUser: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.firsttime_user
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}