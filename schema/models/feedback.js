import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat
} from 'graphql';

export function getFeedbackInputs() {
	return {
		userId: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'user id'
		},
		rating: {
			type: new GraphQLNonNull(GraphQLFloat),
			description: 'rating'
		},
		comment: {
			type: GraphQLString,
			description: 'description'
		},
		source: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'feedback source'
		}
	};
}

export const feedbackFields = {
	...getFeedbackInputs()
};
