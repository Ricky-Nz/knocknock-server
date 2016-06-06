import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { DBFeedback } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {

};

const mutableFields = (update) => ({
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
		createdAt: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'create time'
		}
	},
	...DBFeedback
};