import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLBoolean
} from 'graphql';

export function getUserInputs(update, sensitive) {
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
			type: GraphQLString,
			description: 'user name'
		},
		contact: {
			type: GraphQLString,
			description: 'contact phone number'
		}
	};	
}

export const userFields = {
	...getUserInputs(false, true),
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
};

// export const userPaginationInputs = {
// 	role: {
// 	  type: new GraphQLNonNull(GraphQLString),
// 	  description: 'user role'
// 	},
// 	...searchPaginationInput
// };

// export function resolveUserPagination(obj, {role, search, page, limit}) {
// 	return resolvePagination(DBUser, search?{
// 			$or: [
// 			  {name: {$like: `%${search}%`}},
// 			  {email: {$like: `%${search}%`}},
// 			  {contact: {$like: `%${search}%`}}
// 			],
// 			$and: {
// 				role
// 			}
// 		}:{role}, page, limit);
// }


