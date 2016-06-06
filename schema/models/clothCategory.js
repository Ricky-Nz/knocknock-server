import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { DBCategory } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {

};

const mutableFields = (update) => ({
	nameCn: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'chinese name'
	},
	nameEn: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'english name'
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
		...mutableFields(false),
		count: {
			type: GraphQLInt,
			description: 'items count belong to this category'
		}
	},
	...DBCategory
};