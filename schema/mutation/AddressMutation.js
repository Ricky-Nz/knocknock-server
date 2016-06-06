import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import { User, Address } from '../models';
import { GraphQLUser, GraphQLAddress, GraphQLAddressEdge } from '../query';

const createAddress = mutationWithClientMutationId({
	name: 'CreateAddress',
	inputFields: {
		...Address.inputs
	},
	outputFields: {
		addressEdge: {
			type: GraphQLAddressEdge,
			resolve: (address) => ({
				cursor: offsetToCursor(0),
				node: address
			})
		},
		user: {
			type: GraphQLUser,
			resolve: (address) => User.findById(address.userId)
		}
	},
	mutateAndGetPayload: (args) => Address.create(args)
});

const updateAddress = mutationWithClientMutationId({
	name: 'UpdateAddress',
	inputFields: {
		...Address.updates
	},
	outputFields: {
		address: {
			type: GraphQLAddress,
			resolve: ({id}) => Address.findById(id)
		}
	},
	mutateAndGetPayload: ({id, ...args}) =>
		Address.updateById(id, args).then(() => ({id}))
});

const deleteAddress = mutationWithClientMutationId({
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
			resolve: ({userId}) => User.findById(userId)
		}
	},
	mutateAndGetPayload: ({id}) =>
		Address.findById(id)
			.then(address => address.destroy().then(() => ({userId: address.userId, id})))
});

export default {
	createAddress,
	updateAddress,
	deleteAddress
};

