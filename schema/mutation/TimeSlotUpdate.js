import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import { getTimeSlotInputs } from '../models';
import { GraphQLTimeSlot } from '../query';
import { DBTimeSlot } from '../../database';

export default mutationWithClientMutationId({
	name: 'UpdateTimeSlot',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...getTimeSlotInputs(true)
	},
	outputFields: {
		timeSlot: {
			type: GraphQLTimeSlot,
			resolve: ({localId}) => DBTimeSlot.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);

		return DBTimeSlot.update(args, {where: {id: localId}})
			.then(() => ({localId}));
	}
});
