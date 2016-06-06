import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import { TimeSlot } from '../models';
import { GraphQLTimeSlot } from '../query';

const updateTimeSlot = mutationWithClientMutationId({
	name: 'UpdateTimeSlot',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...TimeSlot.inputs
	},
	outputFields: {
		timeSlot: {
			type: GraphQLTimeSlot,
			resolve: ({localId}) => TimeSlot.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);

		return TimeSlot.update(args, {where: {id: localId}})
			.then(() => ({localId}));
	}
});


export default {
	updateTimeSlot
};