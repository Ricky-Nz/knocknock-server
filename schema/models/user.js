import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLBoolean,
	GraphQLEnumType
} from 'graphql';

import {
	globalIdField,
	fromGlobalId
} from 'graphql-relay';

import { DBUser } from '../../database';
import { searchPaginationInput, resolvePagination } from './pagination';

export const GraphQLUserRole = new GraphQLEnumType({
	name: 'Role',
	description: 'User role',
	values: {
		Client: { value: 'client' },
		Worker: { value: 'worker' },
		Admin: { value: 'admin' }
	}
});

export const userFileds = {
	id: globalIdField('User'),
	role: {
		type: new GraphQLNonNull(GraphQLUserRole),
		description: 'user role'
	},
	email: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'user login email'
	},
	name: {
		type: GraphQLString,
		description: 'user name'
	},
	contact: {
		type: GraphQLString,
		description: 'contact phone number'
	},
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
}

export const userInputs = {
	id: {
	  type: GraphQLString,
	  description: 'user id'
	}
};

export function resolveUser(obj, {id}) {
	const {id: localId} = fromGlobalId(id);
	return DBUser.findById(localId);
}

export const userPaginationInputs = {
	role: {
	  type: new GraphQLNonNull(GraphQLString),
	  description: 'user role'
	},
	...searchPaginationInput
};

export function resloveUserPagination(obj, {role, search, page, limit}) {
	return resolvePagination(DBUser, search?{
			$or: [
			  {name: {$like: `%${search}%`}},
			  {email: {$like: `%${search}%`}},
			  {contact: {$like: `%${search}%`}}
			],
			$and: {
				role
			}
		}:{role}, page, limit);
}


