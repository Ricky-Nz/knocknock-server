import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { DBWorker } from '../../database';
import { GraphQLWorker } from '../query';
import { getWorkerInputs } from '../models';
import { processFileUpload } from '../service';

export default mutationWithClientMutationId({
	name: 'UpdateWorker',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'worker id'
		},
		...getWorkerInputs(true)
	},
	outputFields: {
		worker: {
			type: GraphQLWorker,
			resolve: ({localId}) => DBWorker.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}, context, {rootValue}) =>
		processFileUpload('knocknock-avatar', rootValue.request.file)
			.then(upload => {
				const {id: localId} = fromGlobalId(id);

				if (upload) {
					args.avatarUrl = upload.imageUrl;
					args.avatarId = upload.imageId;
					args.avatarBucket = upload.imageBucket;

					return DBWorker.findById(localId)
						.then(worker => deleteFile(worker.avatarBucket, worker.avatarId))
						.then(() => DBWorker.update(args, {where:{id: localId}}))
						.then(() => ({localId}));
				} else {
					return DBWorker.update(args, {where:{id: localId}})
						.then(() => ({localId}));
				}
			})
});