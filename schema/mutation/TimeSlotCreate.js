import {
	GraphQLList
} from 'graphql';

import {
	mutationWithClientMutationId,
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
	name: 'CreateTimeSlot',
	inputFields: {
		...timeSlotFields
	},
	outputFields: {
		timeSlots: {
			type: new GraphQLList(GraphQLTimeSlot),
			resolve: () => DBTimeSlot.findAll()
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => DBTimeSlot.create(args)
});
