import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { DBTimeSlot } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {
	date: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'date'
	}
};

const mutableFields = (update) => ({
	limit: {
		type: GraphQLInt,
		description: 'limit'
	},
	enabled: {
		type: GraphQLBoolean,
		description: 'time slot enabled'
	}
});

export default {
	inputs: {
		...staticFields,
		...mutableFields()
	},
	updates: {
		...mutableFields(true)
	},
	fields: {
		...staticFields,
		...mutableFields(false, true),
		start: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'start time'
		},
		end: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'end time'
		}
	},
	...DBTimeSlot
};