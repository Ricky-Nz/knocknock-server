import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLUser, GraphQLAddress, GraphQLAddressEdge } from '../query';
import { UserAddresses, Users } from '../../service/database';
import { updateField } from '../utils';

// id			
// user_id			
// name			
// address			
// postal_code			
// apartment_type			
// district_id			
// note			
// created_on			
// unit_number			
// contact_no

const createAddress = mutationWithClientMutationId({
	name: 'CreateAddress',
	inputFields: {
		userId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		postalCode: {
			type: new GraphQLNonNull(GraphQLString)
		},
		address: {
			type: new GraphQLNonNull(GraphQLString)
		},
		contact: {
			type: new GraphQLNonNull(GraphQLString)
		}
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
			resolve: (address) => Users.findById(address.user_id)
		}
	},
	mutateAndGetPayload: ({userId, postalCode, address, contact}) => {
		const {id: dbUserId} = fromGlobalId(userId);
		return UserAddresses.create({
			user_id: dbUserId,
			postal_code: postalCode,
			address: address,
			name: address,
			contact_no: contact
		})
	}
});

const updateAddress = mutationWithClientMutationId({
	name: 'UpdateAddress',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		},
		postalCode: {
			type: GraphQLString
		},
		address: {
			type: GraphQLString
		},
		contact: {
			type: GraphQLString
		}
	},
	outputFields: {
		address: {
			type: GraphQLAddress,
			resolve: ({dbId}) => UserAddresses.findById(dbId)
		}
	},
	mutateAndGetPayload: ({id, postalCode, address, contact}) => {
		const {id: dbId } = fromGlobalId(id);
		return UserAddresses.update({
				...updateField('postal_code', postalCode),
				...updateField('address', address),
				...updateField('contact_no', contact)
			}, {where:{id:dbId}})
		.then(() => ({dbId}));
	}
});

const deleteAddress = mutationWithClientMutationId({
	name: 'DeleteAddress',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		deletedId: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({addressId}) => addressId
		},
		user: {
			type: GraphQLUser,
			resolve: ({userId}) => Users.findById(userId)
		}
	},
	mutateAndGetPayload: ({id}) => {
		const {id: dbId} = fromGlobalId(id);
		return UserAddresses.findById(dbId)
			.then(address => address.destroy().then(() => ({userId: address.userId, addressId: id})))
	}
});

export default {
	createAddress,
	updateAddress,
	deleteAddress
};

