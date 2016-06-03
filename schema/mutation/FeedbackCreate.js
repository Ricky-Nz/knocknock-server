import {
	mutationWithClientMutationId,
	offsetToCursor
} from 'graphql-relay';

import {
	getFeedbackInputs
} from '../models';

import {
	DBFeedback
} from '../../database';

import {
	GraphQLViewer,
	GraphQLFeedbackEdge
} from '../query';

export default mutationWithClientMutationId({
	name: 'CreateFeedback',
	inputFields: {
		...getFeedbackInputs()
	},
	outputFields: {
		feedbackEdge: {
			type: GraphQLFeedbackEdge,
			resolve: (feedback) => ({
				cursor: offsetToCursor(0),
				node: feedback
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => DBFeedback.create(args)
});
