import {
	mutationWithClientMutationId,
	offsetToCursor,
	fromGlobalId,
} from 'graphql-relay';

import {
	getTimeSlotInputs
} from '../models';

import {
	DBViewer,
	DBTimeSlot
} from '../../database';

import {
	GraphQLViewer,
	GraphQLTimeSlotEdge,
	GraphQLTimeSlot
} from '../query';

export default mutationWithClientMutationId({
	name: 'CreateTimeSlot',
	inputFields: {
		...getTimeSlotInputs()
	},
	outputFields: {
		timeSlotEdge: {
			type: GraphQLTimeSlotEdge,
			resolve: (slot) =>
				DBTimeSlot.findAll()
					.then(slots => {
						const index = slots.findIndex(item => item.id === slot.id);
						return {
							cursor: offsetToCursor(index),
							node: slot
						};
					})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => DBTimeSlot.create(args)
});
