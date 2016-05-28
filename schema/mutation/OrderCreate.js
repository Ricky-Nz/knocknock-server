import {
	GraphQLNonNull,
	GraphQLInt,
	GraphQLList
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId,
	toGlobalId,
	offsetToCursor
} from 'graphql-relay';

import {
	getOrderInputs
} from '../models';

import {
	GraphQLOrder,
	GraphQLOrderItemInput,
	GraphQLOrderEdge,
	GraphQLUser
} from '../query';

import { DBOrder, DBUser, DBOrderItem } from '../../database';

export default mutationWithClientMutationId({
	name: 'CreateOrder',
	inputFields: {
		...getOrderInputs(),
		orderItems: {
			type: new GraphQLList(GraphQLOrderItemInput),
			description: 'order items'
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
			type: GraphQLUser,
			resolve: (order) => {
				const {id: localId} = fromGlobalId(order.userId);
				return DBUser.findById(localId);
			}
		}
	},
	mutateAndGetPayload: ({orderItems, ...args}) =>
		DBOrder.create(args)
			.then(order => {
				if (orderItems&&orderItems.length > 0) {
					const orderId = toGlobalId('Order', order.id);
					const bulkItems = orderItems.map(item =>
						({...item, orderId}));
					return DBOrderItem.bulkCreate(bulkItems)
						.then(() => order)
				} else {
					return order;
				}
			})
});
