import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

   // { id: 6,
   //   name: 'test7',
   //   start_date: Sun Apr 03 2016 17:58:00 GMT+0800 (SGT),
   //   end_date: Wed Apr 06 2016 09:30:00 GMT+0800 (SGT),
   //   status: 1,
   //   limit: 3,
   //   allow_multiple_use: true,
   //   only_app: null,
   //   promo_type: 1,
   //   discount_percent: null,
   //   flat_discount: 1,
   //   created_at: Sun Apr 03 2016 10:03:21 GMT+0800 (SGT),
   //   created_by: 'Admin ',
   //   updated_at: Mon Apr 04 2016 13:22:59 GMT+0800 (SGT),
   //   updated_by: 'Admin ',
   //   code: 'UunNkaK',
   //   remarks: '',
   //   user_limit: 2,
   //   per_user_limit: 3,
   //   firsttime_user: false },

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'PromoCode',
	  fields: {
	  	id: globalIdField('PromoCode'),
			enabled: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.status == 1
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