import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat
} from 'graphql';

export const timeSlotFields = {
	start: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'start time'
	},
	end: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'end time'
	},
	enabled: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'enabled'
	}
};