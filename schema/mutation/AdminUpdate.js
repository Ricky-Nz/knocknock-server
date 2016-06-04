import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { DBAdmin } from '../../database';
import { GraphQLAdmin } from '../query';
import { getAdminInputs } from '../models';

export default mutationWithClientMutationId({
	name: 'UpdateAdmin',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'admin id'
		},
		...getAdminInputs(true)
	},
	outputFields: {
		admin: {
			type: GraphQLAdmin,
			resolve: ({localId}) => DBAdmin.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return DBAdmin.update(args, {where:{id: localId}})
			.then(() => ({localId}));
	}
});