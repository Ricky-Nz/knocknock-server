import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLLoginUser, GraphQLAddress, GraphQLAddressEdge } from '../query';
import { UserAddresses, Users } from '../../service/database';
import { updateField } from '../utils';

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
		postalCode: {
			type: new GraphQLNonNull(GraphQLString)
		},
		address: {
			type: new GraphQLNonNull(GraphQLString)
		},
		unitNumber: {
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
			type: GraphQLLoginUser,
			resolve: (address) => Users.findById(address.user_id)
		}
	},
	mutateAndGetPayload: ({postalCode, address, unitNumber, contact}, {userId}) =>
		UserAddresses.create({
			user_id: userId,
			postal_code: postalCode,
			address: address,
			unit_number: unitNumber,
			name: address,
			contact_no: contact
		})
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
		unitNumber: {
			type: GraphQLString
		},
		contact: {
			type: GraphQLString
		}
	},
	outputFields: {
		address: {
			type: GraphQLAddress,
			resolve: ({localId}) => UserAddresses.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, postalCode, address, unitNumber, contact}, {userId}) => {
		const {id: localId } = fromGlobalId(id);
		return UserAddresses.update({
				...updateField('postal_code', postalCode),
				...updateField('address', address),
				...updateField('unit_number', unitNumber),
				...updateField('contact_no', contact)
			}, {where:{$and:{
				id: localId,
				user_id: userId
			}}}).then(() => ({localId}));
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
			type: GraphQLLoginUser,
			resolve: ({userId}) => Users.findById(userId)
		}
	},
	mutateAndGetPayload: ({id}, {userId}) => {
		const {id: dbId} = fromGlobalId(id);
		return UserAddresses.destroy({where:{$and:{
				user_id: userId,
				id: dbId
			}}}).then(() => ({userId, addressId: id}))
	}
});

export default {
	createAddress,
	updateAddress,
	deleteAddress
};

