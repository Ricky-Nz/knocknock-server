import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor,
	fromGlobalId } from 'graphql-relay';
import { DBWorker } from '../../database';
import { GraphQLViewer } from '../query';
import { deleteFile } from '../../datastorage';

export default mutationWithClientMutationId({
	name: 'DeleteWorker',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'worker id'
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
		return DBWorker.findById(localId)
			.then(worker => deleteFile(worker.avatarBucket, worker.avatarId))
			.then(() => DBWorker.destroy({where:{id:localId}}))
			.then(() => ({id}));
	}
});
