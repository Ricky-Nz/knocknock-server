import {
	GraphQLString,
	GraphQLNonNull,
	GraphQLList
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	getOrderInputs
} from '../models';

import {
	GraphQLOrder,
	GraphQLOrderItem
} from '../query';

import {
	DBOrder
} from '../../database';

export default mutationWithClientMutationId({
	name: 'UpdateOrder',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update order id'
		},
		...getOrderInputs(true)
	},
	outputFields: {
		order: {
			type: GraphQLOrder,
			resolve: ({localId}) => DBOrder.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return DBOrder.update(args, {where:{id: localId}})
			.then(() => ({localId}));
	}
});
