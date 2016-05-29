import {
	GraphQLString,
	GraphQLBoolean,
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
	name: 'BluckUpdateOrder',
	inputFields: {
		ids: {
			type: new GraphQLList(GraphQLString),
			description: 'update order ids'
		},
		status: {
			type: GraphQLString,
			description: 'new status'
		},
		pickupWorkerId: {
			type: GraphQLString,
			description: 'pickup worker id'
		}
	},
	outputFields: {
		result: {
			type: GraphQLBoolean,
			resolve: () => true
		}
	},
	mutateAndGetPayload: ({ids, status, pickupWorkerId}) => {
		const localIds = ids.map(id => {
			const {id: localId} = fromGlobalId(id);
			return localId;
		});

		let update = {};
		if (status) {
			update.status = status;
		}
		if (pickupWorkerId) {
			update.pickupWorkerId = pickupWorkerId;
		}
		
		return DBOrder.update(update, {where:{id: {$in: localIds}}});
	}
});
