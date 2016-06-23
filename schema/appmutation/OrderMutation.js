import { GraphQLString, GraphQLNonNull, GraphQLList, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLLoginUser, GraphQLAddress, GraphQLAddressEdge, GraphQLOrderItemInput,
	GraphQLOrderEdge, GraphQLOrder } from '../query';
import { Users, Orders, OrderStatuses, OrderDetails, OrderTransactions, UserVouchers, PromoCodes } from '../../service/database';
import { payByStripeCardId, payByStripeToken, completePaypalExpressPayment, requestPaypalExpressUrl } from '../../service/payment';
import { formatTime, formatPrice, prepareOrderItems } from '../utils';
import { processOrderPayment } from '../paymentUtils';

const cancelOrder = mutationWithClientMutationId({
	name: 'CancelOrder',
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
		return OrderStatuses.findOne({where:{stage: 8}})
			.then(status => Orders.update({order_status_id: status.id}, {
				where: {$and: {
					user_id: userId,
					id: dbId
				}}
			})).then(() => ({userId, id}));
	}
});

const createOrder = mutationWithClientMutationId({
	name: 'CreateOrder',
	inputFields: {
    express: {
      type: GraphQLBoolean
    },
    note: {
      type: GraphQLString
    },
    pickupDate: {
      type: new GraphQLNonNull(GraphQLString)
    },
    pickupTime: {
      type: new GraphQLNonNull(GraphQLString)
    },
    pickupAddress: {
      type: new GraphQLNonNull(GraphQLString)
    },
    pickupPostalCode: {
      type: new GraphQLNonNull(GraphQLString)
    },
    pickupContactNo: {
    	type: new GraphQLNonNull(GraphQLString)
    },
		orderItems: {
			type: new GraphQLList(GraphQLOrderItemInput)
		}
	},
	outputFields: {
		orderEdge: {
			type: GraphQLOrderEdge,
			resolve: (order) => ({
				cursor: offsetToCursor(0),
				node: order
			})
		},
		user: {
			type: GraphQLLoginUser,
			resolve: (order) => Users.findById(order.user_id)
		}
	},
	mutateAndGetPayload: ({express, note, pickupDate,
		pickupTime, pickupAddress, pickupPostalCode, pickupContactNo, orderItems}, {userId}) => {

		return OrderStatuses.findOne({where:{stage:0}})
			.then(status => Orders.create({
				user_id: userId,
				express_order: express,
				description: note,
				order_status_id: status.id,
				pickup_date: formatTime(pickupDate),
				pickup_time: pickupTime,
				pickup_address: pickupAddress,
				pickup_postal_code: pickupPostalCode,
				pickup_contact_no: pickupContactNo,
				created_on: new Date()
			}))
			.then(order => {
				if (!orderItems || orderItems.length === 0) {
					return order;
				} else {
					return prepareOrderItems(order.id, orderItems)
						.then(items => OrderDetails.bulkCreate(items))
						.then(() => order);
				}
			})
	}
});

const payOrderByCredit = mutationWithClientMutationId({
	name: 'PayOrderByCredit',
	inputFields: {
		orderId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		voucherId: {
			type: GraphQLString
		},
		promoCodeId: {
			type: GraphQLString
		}
	},
	outputFields: {
		order: {
			type: GraphQLOrder,
			resolve: ({localOrderId}) => Orders.findById(localOrderId)
		}
	},
	mutateAndGetPayload: ({orderId, voucherId, promoCodeId}, {userId}) =>
		processOrderPayment({userId, orderId, voucherId, promoCodeId}, ({localOrderId, toPayPrice}) => {
			return Users.findById(userId)
				.then(user => {
					if (!user) throw 'user not found';
					if (user.credit < toPayPrice) throw 'credit not enough';

					return user.decrement({credit, toPayPrice})
				})
				.then(() => ({
					success: true,
					paymentMode: 'credit'
				}));
		})
});

const payOrderByPaypal = mutationWithClientMutationId({
	name: 'PayOrderByPaypal',
	inputFields: {
		orderId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		voucherId: {
			type: GraphQLString
		},
		promoCodeId: {
			type: GraphQLString
		}
	},
	outputFields: {
		user: {
			type: GraphQLLoginUser,
			resolve: ({userId, url}) =>
				Users.findById(userId).then(user => {
					user.paypalPayUrl = url;
					return user;
				})
		}
	},
	mutateAndGetPayload: ({orderId, voucherId, promoCodeId}, {userId}) =>
		requestPaypalExpressUrl({amount, currency, params:{orderId, voucherId, promoCodeId, userId}})
			.then(({url, token}) => ({url, userId}))
});

const payOrderByStrip = mutationWithClientMutationId({
	name: 'PayOrderByStrip',
	inputFields: {
		orderId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		tokenId: {
			type: GraphQLString
		},
		cardId: {
			type: GraphQLString
		},
		voucherId: {
			type: GraphQLString
		},
		promoCodeId: {
			type: GraphQLString
		}
	},
	outputFields: {
		order: {
			type: GraphQLOrder,
			resolve: ({localOrderId}) => Orders.findById(localOrderId)
		}
	},
	mutateAndGetPayload: ({orderId, cardId, tokenId, voucherId, promoCodeId}, {userId}) =>
		processOrderPayment({userId, orderId, voucherId, promoCodeId}, ({localOrderId, toPayPrice}) => {
			if (tokenId) {
				return payByStripeToken({
					amount: toPayPrice * 100,
					description: `Pay Order: ${localOrderId}`,
					tokenId
				})
				.then(({id, status}) => ({
					success: status === 'succeeded',
					paymentMode: 'creditcard',
					paymentRefToken: id
				}));
			} else if (cardId) {
				return Users.findById(userId)
					.then(user => {
						if (!user) throw 'user not found';
						if (!user.stripe_customer_id) throw 'not a stripe customer';

						const {id: localCardId} = fromGlobalId(cardId);

						return UserCreditCards.findOne({where:{$and:{
								user_id: userId,
								id: localCardId
							}}})
							.then(card => {
								if (!card) throw 'card not found';

								return payByStripeCardId({
									customerId: user.stripe_customer_id,
									cardId: card.stripe_card_id,
									amount: toPayPrice * 100,
									description: `Pay Order: ${localOrderId}`
								})
								.then(({id, status}) => ({
									success: status === 'succeeded',
									paymentMode: 'creditcard',
									paymentRefToken: id
								}));
							});
					});
			} else {
				throw 'tokenId or cardId must be provided';
			}
		})
});

export default {
	cancelOrder,
	createOrder,
	payOrderByCredit,
	payOrderByPaypal,
	payOrderByStrip
};

