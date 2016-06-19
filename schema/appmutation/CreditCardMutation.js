import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLLoginUser, GraphQLCreditCardEdge } from '../query';
import { UserCreditCards, Users } from '../../service/database';
import { createCustomer, createCard } from '../../service/payment';

// { id: 381,
//   user_id: 5893,
//   stripe_card_id: 'card_18LbCHFNOwmsxf6nFg2SQX4Q',
//   brand: 'MasterCard',
//   country: 'TW',
//   cvc_check: 'pass',
//   dynamic_last4: null,
//   exp_month: 3,
//   exp_year: 2021,
//   funding: 'credit',
//   last4: '4255',
//   name: 'Cheng Chwen Jung',
//   tokenization_method: null,
//   fingerprint: '9gzX8X9BSwsRHoNj',
//   first6: '552000' }

const addCreditCard = mutationWithClientMutationId({
	name: 'AddCreditCard',
	inputFields: {
		tokenId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		stripeCardId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		brand: {
			type: new GraphQLNonNull(GraphQLString)
		},
		cvcCheck: {
			type: new GraphQLNonNull(GraphQLString)
		},
		last4: {
			type: new GraphQLNonNull(GraphQLString)
		},
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		country: {
			type: GraphQLString
		},
		expMonth: {
			type: GraphQLString
		},
		expYear: {
			type: GraphQLString
		},
		funding: {
			type: GraphQLString
		}
	},
	outputFields: {
		creditCardEdge: {
			type: GraphQLCreditCardEdge,
			resolve: (card) => ({
				cursor: offsetToCursor(0),
				node: card
			})
		},
		user: {
			type: GraphQLLoginUser,
			resolve: (card) => Users.findById(card.user_id)
		}
	},
	mutateAndGetPayload: ({tokenId, stripeCardId, brand, cvcCheck, last4, name, country, expMonth, expYear, funding}, {userId}) =>
		Users.findById(userId)
			.then(user => createCard({tokenId, customerId: user.stripe_customer_id}))
			.then(cards => {
				console.log(cards);
				return UserCreditCards.create({
				  user_id: userId,
				  stripe_card_id: stripeCardId,
				  brand,
				  country,
				  cvc_check: cvcCheck,
				  exp_month: expMonth,
				  exp_year: expYear,
				  funding,
				  last4,
				  name
				});
			})
});

const removeCreditCard = mutationWithClientMutationId({
	name: 'RemoveCreditCard',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		deletedId: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({id}) => id
		},
		user: {
			type: GraphQLLoginUser,
			resolve: ({userId}) => Users.findById(userId)
		}
	},
	mutateAndGetPayload: ({id}, {userId}) => {
		const {id: dbId} = fromGlobalId(id);
		return UserCreditCards.destroy({where:{$and:{
				user_id: userId,
				id: dbId
			}}}).then(() => ({userId, id}))
	}
});

export default {
	addCreditCard,
	removeCreditCard
};

