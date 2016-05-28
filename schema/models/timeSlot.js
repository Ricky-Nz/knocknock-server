import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInt
} from 'graphql';

export function getTimeSlotInputs(update) {
	return {
		start: {
			type: update ? GraphQLInt : new GraphQLNonNull(GraphQLInt),
			description: 'start time'
		},
		end: {
			type: update ? GraphQLInt : new GraphQLNonNull(GraphQLInt),
			description: 'end time'
		},
		enabled: {
			type: update ? GraphQLBoolean : new GraphQLNonNull(GraphQLBoolean),
			description: 'enabled'
		}
	};
}

export const timeSlotFields = {
	...getTimeSlotInputs()
};