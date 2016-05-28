import {
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

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
		}
	};
}

export const addressFields = {
	...getAddressInputs()
};