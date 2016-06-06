import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLWorkerEdge, GraphQLViewer } from '../query';
import { Worker } from '../models';
import { processFileUpload } from '../service';
import { deleteFile } from '../../datastorage';

const createWorker = mutationWithClientMutationId({
	name: 'CreateWorker',
	inputFields: {
		...Worker.inputs
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

				return Worker.create(args);
			})
});

const updateWorker = mutationWithClientMutationId({
	name: 'UpdateWorker',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'worker id'
		},
		...Worker.updates
	},
	outputFields: {
		worker: {
			type: GraphQLWorker,
			resolve: ({localId}) => Worker.findById(localId)
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

					return Worker.findById(localId)
						.then(worker => deleteFile(worker.avatarBucket, worker.avatarId))
						.then(() => Worker.update(args, {where:{id: localId}}))
						.then(() => ({localId}));
				} else {
					return Worker.update(args, {where:{id: localId}})
						.then(() => ({localId}));
				}
			})
});

const deleteWorker = mutationWithClientMutationId({
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
		return Worker.findById(localId)
			.then(worker => deleteFile(worker.avatarBucket, worker.avatarId))
			.then(() => Worker.destroy({where:{id:localId}}))
			.then(() => ({id}));
	}
});

export default {
	createWorker,
	updateWorker,
	deleteWorker
};


