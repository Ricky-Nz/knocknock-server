import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import { GraphQLViewer, GraphQLFeedbackEdge } from '../query';
import { UserFeedbacks } from '../../service/database';

// id      
// user_id     
// rating      
// comment     
// created

const createFeedback = mutationWithClientMutationId({
	name: 'CreateFeedback',
	inputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    rating: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    comment: {
      type: GraphQLString
    }
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
	mutateAndGetPayload: ({userId, rating, comment}) => {
		const {id: localId} = fromGlobalId(userId);

		return UserFeedbacks.create({
			user_id: localId,
			rating,
			comment,
			created: new Date()
		});
	}
});

export default {
	createFeedback
};
