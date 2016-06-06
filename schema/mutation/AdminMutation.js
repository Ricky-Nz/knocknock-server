import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLAdminEdge, GraphQLViewer } from '../query';
import { Admin } from '../models';

const createAdmin = mutationWithClientMutationId({
	name: 'CreateAdmin',
	inputFields: {
		...Admin.inputs
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
	mutateAndGetPayload: (args) => Admin.create(args)
});

const updateAdmin = mutationWithClientMutationId({
	name: 'UpdateAdmin',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'admin id'
		},
		...Admin.updates
	},
	outputFields: {
		admin: {
			type: GraphQLAdmin,
			resolve: ({localId}) => Admin.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return Admin.update(args, {where:{id: localId}})
			.then(() => ({localId}));
	}
});

const deleteAdmin = mutationWithClientMutationId({
	name: 'DeleteAdmin',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'admin id'
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
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return Admin.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});

export default {
	createAdmin,
	updateAdmin,
	deleteAdmin
};

