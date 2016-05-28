import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import { DBWorker } from '../../database';
import { GraphQLWorkerEdge, GraphQLViewer } from '../query';
import { getWorkerInputs } from '../models';
import { processFileUpload } from '../service';

export default mutationWithClientMutationId({
	name: 'CreateWorker',
	inputFields: {
		...getWorkerInputs()
	},
	outputFields: {
		workerEdge: {
			type: GraphQLWorkerEdge,
			resolve: (worker) => ({
				cursor: offsetToCursor(0),
				node: worker
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args, context, {rootValue}) =>
		processFileUpload('knocknock-avatar', rootValue.request.file)
			.then(upload => {
				if (upload) {
					args.avatarUrl = upload.imageUrl;
					args.avatarId = args.imageId;
					args.avatarBucket = args.imageBucket;
				}

				return DBWorker.create(args);
			})
});