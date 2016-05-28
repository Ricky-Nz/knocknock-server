import {
	GraphQLNonNull,
	GraphQLBoolean,
	GraphQLInt
} from 'graphql';

export const walletFields = {
	credit: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'wallet credit'
	},
	freeze: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'freeze'
	}
};