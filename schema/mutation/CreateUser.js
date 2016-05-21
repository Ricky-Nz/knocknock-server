import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import { DBUser } from '../../database';
import { GraphQLUserEdge } from '../query';

export default mutationWithClientMutationId({
	name: 'CreateUser',
	inputFields: {
		role: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'user role'
		},
		email: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'login email address'
		},
		password: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'user login password'
		}
	},
	outputFields: {
		userEdge: {
			type: GraphQLUserEdge,
			resolve: (newUser) => ({
				cursor: offsetToCursor(0),
				node: newUser
			})
		}
	},
	mutateAndGetPayload: (args) => DBUser.create(args)
});