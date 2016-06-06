import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { DBFactory } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {

};

const mutableFields = (update) => ({
	name: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'factory name'
	},
	address: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'factory address'
	},
	postalCode: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'address postal code'
	},
	contact: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'contact number'
	},
	contactName: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'contact name'
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
	...DBFactory
};