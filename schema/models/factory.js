import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat
} from 'graphql';

export function getFactoryInputs(update) {
	return {
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
	};
}

export const factoryFields = {
	...getFactoryInputs()
};