import {
	GraphQLString,
	GraphQLNonNull
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	getAddressInputs
} from '../models';

import {
	GraphQLAddress
} from '../query';

import {
	DBAddress
} from '../../database';

export default mutationWithClientMutationId({
	name: 'UpdateAddress',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...getAddressInputs(true)
	},
	outputFields: {
		address: {
			type: GraphQLAddress,
			resolve: ({localId}) => DBAddress.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return DBAddress.update(args, {where: {id: localId}})
			.then(() => ({localId}));
	}
});
