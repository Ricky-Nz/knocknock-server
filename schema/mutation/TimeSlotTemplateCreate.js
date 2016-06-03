import {
	mutationWithClientMutationId,
	offsetToCursor,
	fromGlobalId,
} from 'graphql-relay';

import {
	getTimeSlotTemplateInputs
} from '../models';

import {
	DBViewer,
	DBTimeSlotTemplate
} from '../../database';

import {
	GraphQLViewer,
	GraphQLTimeSlotTemplateEdge,
	GraphQLTimeSlotTemplate
} from '../query';

export default mutationWithClientMutationId({
	name: 'CreateTimeSlotTemplate',
	inputFields: {
		...getTimeSlotTemplateInputs()
	},
	outputFields: {
		timeSlotTemplateEdge: {
			type: GraphQLTimeSlotTemplateEdge,
			resolve: (slot) => ({
				cursor: offsetToCursor(0),
				node: slot
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => DBTimeSlotTemplate.create(args)
});
