import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} from 'graphql';

export function getTimeSlotInputs() {
	return {
		date: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'date'
		},
		limit: {
			type: GraphQLInt,
			description: 'limit'
		},
		enabled: {
			type: GraphQLBoolean,
			description: 'time slot enabled'
		}
	};
}

export const timeSlotFields = {
	...getTimeSlotInputs(),
	start: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'start time'
	},
	end: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'end time'
	}
};