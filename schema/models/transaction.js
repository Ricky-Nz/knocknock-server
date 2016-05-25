import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLBoolean,
	GraphQLEnumType,
	GraphQLFloat
} from 'graphql';

export const transactionFields = {
	userId: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'user id'
	},
	value: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'transaction value'
	},
	type: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'transaction type'
	},
	orderId: {
		type: GraphQLString,
		description: 'related orderId'
	},
	description: {
		type: GraphQLString,
		description: 'transaction description'
	}
};