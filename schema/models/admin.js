import {
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

export function getAdminInputs(update, sensitive) {
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
			type: GraphQLString,
			description: 'contact phone number'
		}
	};	
}

export const adminFields = {
	...getAdminInputs(false, true)
};

