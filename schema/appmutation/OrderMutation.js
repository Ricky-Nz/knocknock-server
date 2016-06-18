import { GraphQLString, GraphQLNonNull, GraphQLList, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLLoginUser, GraphQLAddress, GraphQLAddressEdge, GraphQLOrderItemInput,
	GraphQLOrderEdge } from '../query';
import { Users, Orders, OrderStatuses, OrderDetails } from '../../service/database';
import { formatTime, prepareOrderItems } from '../utils';

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

export default {
	cancelOrder,
	createOrder
};

