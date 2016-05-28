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
		processFileUpload('knocknock-avatar', args, rootValue.request.file)
			.then(upload => {
				if (upload) {
					args.avatarUrl = upload.imageUrl;
					args.avatarId = upload.imageId;
					args.avatarBucket = upload.imageBucket;
				}

				const {id: localId} = fromGlobalId(id);
				return DBUser.update(args, {where:{id: localId}})
					.then(() => ({localId}));
			})
});