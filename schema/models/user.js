import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLBoolean,
	GraphQLEnumType,
	GraphQLFloat
} from 'graphql';

import { DBUser } from '../../database';
import { searchPaginationInput, resolvePagination } from './pagination';

export function getVoucherInputs() {
	return {
		userId: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'user id'
		},
		title: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'voucher title'
		},
		value: {
			type: new GraphQLNonNull(GraphQLFloat),
			description: 'voucher value'
		},
		expireOn: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'voucher expire on'
		}
	};
}

export function getVoucherFields() {
	return {
		...getVoucherInputs(),
		used: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'voucher used'
		},
		usedOn: {
			type: GraphQLString,
			description: 'voucher used date'
		},
		usedOrderId: {
			type: GraphQLString,
			description: 'voucher used on order id'
		}
	};
}

export function getAddressInputs(update) {
	return {
		...!update&&{
			userId: {
				type: new GraphQLNonNull(GraphQLString),
				description: 'user id'
			}
		},
		postalCode: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'address postal code'
		},
		address: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'address detail'
		},
		contact: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'contact phone number'
		},
	};
}

export function getUserInputs(update) {
	return {
		...!update&&{
			role: {
				type: new GraphQLNonNull(GraphQLString),
				description: 'user role'
			}
		},
		...!update&&{
			email: {
				type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
				description: 'user login email'
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
		password: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'login password'
		}
	};	
}

export function getUserFields() {
	let fields = {
		...getUserInputs(),
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

	delete fields.password;

	return fields;
}

export const userPaginationInputs = {
	role: {
	  type: new GraphQLNonNull(GraphQLString),
	  description: 'user role'
	},
	...searchPaginationInput
};

export function resolveUserPagination(obj, {role, search, page, limit}) {
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


