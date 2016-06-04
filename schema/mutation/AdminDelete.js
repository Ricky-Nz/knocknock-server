import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId,
	offsetToCursor, fromGlobalId } from 'graphql-relay';
import { DBAdmin } from '../../database';
import { GraphQLViewer } from '../query';

export default mutationWithClientMutationId({
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
		return DBAdmin.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});
