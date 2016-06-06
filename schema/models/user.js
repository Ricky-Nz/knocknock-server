import { GraphQLNonNull, GraphQLString, GraphQLBoolean} from 'graphql';
import { DBUser } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {
	email: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
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
		type: GraphQLString,
		description: 'user name'
	},
	contact: {
		type: GraphQLString,
		description: 'contact phone number'
	},
	enabled: {
		type: GraphQLBoolean,
		description: 'enabled'
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
		},
		emailVerified: {
			type: GraphQLBoolean,
			description: 'login email verified'
		},
		contactVerified: {
			type: GraphQLBoolean,
			description: 'contact phoen verified'
		}
	},
	...DBUser
};

