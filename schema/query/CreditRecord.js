import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, toGlobalId } from 'graphql-relay';
import { Users } from '../../service/database';
import { toDisplayDate } from '../utils';

  // { id: 1461,
  //   user_id: 5200,
  //   amount: '50.00',
  //   paypal_ref_no: 'card_18J0JhFNOwmsxf6nFhCoyW90',
  //   top_up: true,
  //   created_on: Sun Jun 05 2016 12:25:41 GMT+0800 (SGT),
  //   payment_mode: 'creditcard',
  //   status: 1,
  //   approved_on: Sun Jun 05 2016 12:25:41 GMT+0800 (SGT),
  //   approved_by: 'Stripe',
  //   remarks: null },

export default function (nodeInterface, {GraphQLUserRef}) {
	const nodeType = new GraphQLObjectType({
	  name: 'CreditRecord',
	  fields: {
	  	id: globalIdField('CreditRecord'),
			amount: {
				type: GraphQLFloat,
				resolve: (obj) => obj.amount
			},
			paymentRefNo: {
				type: GraphQLString,
				resolve: (obj) => obj.paypal_ref_no
			},
			topUp: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.top_up
			},
			createdAt: {
				type: GraphQLString,
				resolve: (obj) => obj.created_on&&toDisplayDate(obj.created_on, true)
			},
			paymentMode: {
				type: GraphQLString,
				resolve: (obj) => obj.payment_mode
			},
			status: {
				type: GraphQLInt,
				resolve: (obj) => obj.status
			},
			approvedAt: {
				type: GraphQLString,
				resolve: (obj) => obj.approved_on&&toDisplayDate(obj.approved_on)
			},
			approvedBy: {
				type: GraphQLString,
				resolve: (obj) => obj.approved_by
			},
			description: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.remarks
			},
			user: {
				type: GraphQLUserRef,
				resolve: (obj) => Users.findById(obj.user_id)
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}