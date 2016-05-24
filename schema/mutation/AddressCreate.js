import {
	GraphQLList
} from 'graphql';

import {
	mutationWithClientMutationId,
	offsetToCursor,
	fromGlobalId,
} from 'graphql-relay';

import {
	getAddressInputs
} from '../models';

import {
	DBUser,
	DBAddress
} from '../../database';

import {
	GraphQLUser,
	GraphQLAddress,
	GraphQLAddressEdge
} from '../query';

export default mutationWithClientMutationId({
	name: 'CreateAddress',
	inputFields: {
		...getAddressInputs()
	},
	outputFields: {
		addressEdge: {
			type: GraphQLAddressEdge,
			resolve: (address) =>
				DBAddress.findAll()
					.then(addresses => {
						const index = addresses.findIndex(item => item.id === address.id);
						return {
							cursor: offsetToCursor(index),
							node: address
						};
					})
		},
		user: {
			type: GraphQLUser,
			resolve: (address) => {
				const {id: localId} = fromGlobalId(address.userId);
				return DBUser.findById(localId);
			}
		}
	},
	mutateAndGetPayload: (args) => DBAddress.create(args)
});
