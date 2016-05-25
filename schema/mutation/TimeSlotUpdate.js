import {
	GraphQLList,
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	timeSlotFields
} from '../models';

import {
	DBTimeSlot
} from '../../database';

import {
	GraphQLViewer,
	GraphQLTimeSlot
} from '../query';

export default mutationWithClientMutationId({
	name: 'UpdateTimeSlot',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'time slot id'
		},
		...timeSlotFields
	},
	outputFields: {
		timeSlot: {
			type: GraphQLTimeSlot,
			resolve: ({localId}) => DBTimeSlot.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return DBTimeSlot.update(args, {where:{id:localId}})
			.then(() => ({localId}))
	}
});
