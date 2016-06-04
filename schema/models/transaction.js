import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLEnumType,
	GraphQLFloat
} from 'graphql';

export const transactionFields = {
	walletId: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'wallet Id'
	},
	value: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'transaction value'
	},
	currency: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'value currency'
	},
	referenceNo: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'transaction reference number'
	},
	paymentMode: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'transaction payment mode'
	},
	paymentChannel: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'transaction channel'
	},
	status: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'transaction status'
	},
	createdAt: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'created at'
	}
};