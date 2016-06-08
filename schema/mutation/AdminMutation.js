import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLAdminEdge, GraphQLAdmin, GraphQLViewer } from '../query';
import { Admins } from '../../service/database';

// id			
// first_name			
// last_name			
// address			
// postal_code			
// contact_no			
// created_on			
// email			
// encrypted_password			
// reset_password_token			
// reset_password_sent_at

const createAdmin = mutationWithClientMutationId({
	name: 'CreateAdmin',
	inputFields: {
		email: {
			type: new GraphQLNonNull(GraphQLString)
		},
		password: {
			type: new GraphQLNonNull(GraphQLString)
		},
		firstName: {
			type: new GraphQLNonNull(GraphQLString)
		},
		lastName: {
			type: new GraphQLNonNull(GraphQLString)
		},
		contact: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		adminEdge: {
			type: GraphQLAdminEdge,
			resolve: (admin) => ({
				cursor: offsetToCursor(0),
				node: admin
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: ({email, password, firstName, lastName, contact}) =>
		Admins.create({
			email: email,
			encrypted_password: password,
			first_name: firstName,
			last_name: lastName,
			contact_no: contact,
			created_on: new Date()
		})
});

const updateAdmin = mutationWithClientMutationId({
	name: 'UpdateAdmin',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		},
		password: {
			type: GraphQLString
		},
		firstName: {
			type: GraphQLString
		},
		lastName: {
			type: GraphQLString
		},
		contact: {
			type: GraphQLString
		}
	},
	outputFields: {
		admin: {
			type: GraphQLAdmin,
			resolve: ({localId}) => Admins.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, password, firstName, lastName, contact}) => {
		const {id: localId} = fromGlobalId(id);
		return Admins.update({
				first_name: firstName,
				last_name: lastName,
				contact_no: contact,
				encrypted_password: password 
			}, {where:{id: localId}}).then(() => ({localId}));
	}
});

const deleteAdmin = mutationWithClientMutationId({
	name: 'DeleteAdmin',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		deletedId: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({id}) => id
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: ({id}) => {
		const {id: localId} = fromGlobalId(id);
		return Admins.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});

export default {
	createAdmin,
	updateAdmin,
	deleteAdmin
};

