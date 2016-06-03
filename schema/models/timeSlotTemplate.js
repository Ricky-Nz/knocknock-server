import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInt
} from 'graphql';

export function getTimeSlotTemplateInputs(update) {
	return {
		start: {
			type: update ? GraphQLInt : new GraphQLNonNull(GraphQLInt),
			description: 'start time'
		},
		end: {
			type: update ? GraphQLInt : new GraphQLNonNull(GraphQLInt),
			description: 'end time'
		},
		limit: {
			type: update ? GraphQLInt : new GraphQLNonNull(GraphQLInt),
			description: 'default slot limit'
		}
	};
}

export const timeSlotTemplateFields = {
	...getTimeSlotTemplateInputs()
};