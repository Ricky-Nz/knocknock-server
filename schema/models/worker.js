import {
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

export function getWorkerInputs(update, sensitive) {
	return {
		...!update&&{
			email: {
				type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
				description: 'user login email'
			}
		},
		...!sensitive&&{
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
		}
	};	
}

export const workerFields = {
	...getWorkerInputs(false, true),
	avatarUrl: {
		type: GraphQLString,
		description: 'avatar image url'
	}
};

