import { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLLoginUser, GraphQLAddress, GraphQLAddressEdge, GraphQLOrderItemInput,
	GraphQLOrderEdge } from '../query';
import { Users, UserCredits, UserCreditCards } from '../../service/database';
import { payByStripeCardId, payByStripeToken } from '../../service/payment';

// { id: 'ch_18NwJQFNOwmsxf6nDypxWtDU',
//   object: 'charge',
//   amount: 100,
//   amount_refunded: 0,
//   application_fee: null,
//   balance_transaction: 'txn_18NwJQFNOwmsxf6nrTqNfRdi',
//   captured: true,
//   created: 1466305768,
//   currency: 'sgd',
//   customer: null,
//   description: 'TOPUP user: 198',
//   destination: null,
//   dispute: null,
//   failure_code: null,
//   failure_message: null,
//   fraud_details: {},
//   invoice: null,
//   livemode: false,
//   metadata: {},
//   order: null,
//   paid: true,
//   receipt_email: null,
//   receipt_number: null,
//   refunded: false,
//   refunds: 
//    { object: 'list',
//      data: [],
//      has_more: false,
//      total_count: 0,
//      url: '/v1/charges/ch_18NwJQFNOwmsxf6nDypxWtDU/refunds' },
//   shipping: null,
//   source: 
//    { id: 'card_18NwJMFNOwmsxf6nUE5rmx3y',
//      object: 'card',
//      address_city: null,
//      address_country: null,
//      address_line1: null,
//      address_line1_check: null,
//      address_line2: null,
//      address_state: null,
//      address_zip: null,
//      address_zip_check: null,
//      brand: 'Visa',
//      country: 'US',
//      customer: null,
//      cvc_check: null,
//      dynamic_last4: null,
//      exp_month: 9,
//      exp_year: 2019,
//      fingerprint: 'BDm7yBQ6FEtTAJ1l',
//      funding: 'credit',
//      last4: '4242',
//      metadata: {},
//      name: 'ruiqi.sg@gmail.com',
//      tokenization_method: null },
//   source_transfer: null,
//   statement_descriptor: null,
//   status: 'succeeded' }

const topUpByStripeCardId = mutationWithClientMutationId({
	name: 'TopUpByStripeCardId',
	inputFields: {
		amount: {
			type: new GraphQLNonNull(GraphQLInt)
		},
		cardId: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		user: {
			type: GraphQLLoginUser,
			resolve: ({userId}) => Users.findById(userId)
		}
	},
	mutateAndGetPayload: ({cardId, amount}, {userId}) =>
		Users.findById(userId)
			.then(user => {
				if (!user.stripe_customer_id) throw 'not a stripe customer';

				const {id: localCardId} = fromGlobalId(cardId);
				return UserCreditCards.findOne({where:{$and:{
					user_id: userId,
					id: localCardId
				}}})
				.then(card => payByStripeCardId({
					customerId: user.stripe_customer_id,
					cardId: card.stripe_card_id,
					amount,
					description: `TOPUP USER: ${user.contact_no}`
				}))
				.then(response =>
					user.update({
						credit: parseFloat(user.credit) + response.amount
					})
				)
				.then(result => ({userId}));
			})
});

const topUpByStripeToken = mutationWithClientMutationId({
	name: 'TopUpByStripeToken',
	inputFields: {
		amount: {
			type: new GraphQLNonNull(GraphQLInt)
		},
		tokenId: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		user: {
			type: GraphQLLoginUser,
			resolve: ({userId}) => Users.findById(userId)
		}
	},
	mutateAndGetPayload: ({amount, tokenId}, {userId}) =>
		Users.findById(userId)
			.then(user => {
				return payByStripeToken({
					amount,
					description: `TOPUP user: ${userId}`,
					tokenId
				})
				.then(response => 
					user.update({
						credit: parseFloat(user.credit) + response.amount
					})
					.then(() => UserCredits.create({
					  user_id: userId,
					  amount: response.amount,
					  paypal_ref_no: response.source.id,
					  top_up: true,
					  created_on: new Date(),
					  payment_mode: 'creditcard',
					  status: response.status === 'succeeded' ? 1 : 0,
					  approved_on: new Date(),
					  approved_by: 'Stripe',
					  remarks: response.description
					}))
				)
				.then(result => ({userId}));
			})
});

export default {
	topUpByStripeCardId,
	topUpByStripeToken
};

