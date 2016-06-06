import { GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';
import { DBTimeSlotTemplate } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {

};

const mutableFields = (update) => ({
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
		...mutableFields(false, true)
	},
	...DBTimeSlotTemplate
};