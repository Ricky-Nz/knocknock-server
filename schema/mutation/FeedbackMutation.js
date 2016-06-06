import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import { Feedback } from '../models';
import { GraphQLViewer, GraphQLFeedbackEdge } from '../query';

const createFeedback mutationWithClientMutationId({
	name: 'CreateFeedback',
	inputFields: {
		...Feedback.inputs
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
	mutateAndGetPayload: (args) => Feedback.create(args)
});

export default {
	createFeedback
};
