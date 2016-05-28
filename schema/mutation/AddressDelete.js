import {
	GraphQLList,
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	GraphQLUser
} from '../query';

import {
	DBUser,
	DBAddress
} from '../../database';

export default mutationWithClientMutationId({
	name: 'DeleteAddress',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'delete item id'
		}
	},
	outputFields: {
		deletedId: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({id}) => id
		},
		user: {
			type: GraphQLUser,
			resolve: ({userId}) => {
				const {id: localId} = fromGlobalId(userId);
				return DBUser.findById(localId);
			}
		}
	},
	mutateAndGetPayload: ({id}) => {
		const {id: localId} = fromGlobalId(id);
		return DBAddress.findById(localId)
			.then((address) => address.destroy().then(() => ({userId: address.userId, id})));
	}
});
