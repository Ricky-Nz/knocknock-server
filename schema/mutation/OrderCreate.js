import {
	GraphQLNonNull,
	GraphQLInt
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId,
	offsetToCursor
} from 'graphql-relay';

import {
	getOrderInputs
} from '../models';

import {
	GraphQLOrder,
	GraphQLOrderEdge,
	GraphQLUser
} from '../query';

import { DBOrder, DBUser } from '../../database';

export default mutationWithClientMutationId({
	name: 'CreateOrder',
	inputFields: {
		...getOrderInputs()
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
	mutateAndGetPayload: (args) => DBOrder.create(args)
});
