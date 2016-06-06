import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { DBWorker } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {
	email: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'user login email'
	}
};

const mutableFields = (update, filterOut) => ({
	...!filterOut&&{
		password: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'login password'
		}
	},
	name: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'user name'
	},
	contact: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'contact phone number'
	},
	enabled: {
		type: update ? GraphQLBoolean : new GraphQLNonNull(GraphQLBoolean),
		description: 'enable'
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
		avatarUrl: {
			type: GraphQLString,
			description: 'avatar image url'
		}
	},
	...DBWorker
};
