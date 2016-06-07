import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import { Cloth } from '../models';
import { GraphQLCloth, GraphQLClothEdge, GraphQLViewer } from '../query';
import { processFileUpload } from '../service';
import { deleteFile } from '../../service/datastorage';

const createCloth = mutationWithClientMutationId({
	name: 'CreateCloth',
	inputFields: {
		...Cloth.inputs
	},
	outputFields: {
		clothEdge: {
			type: GraphQLClothEdge,
			resolve: (newCloth) => ({
				cursor: offsetToCursor(0),
				node: newCloth
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args, context, {rootValue}) =>
		processFileUpload('knocknock-laundry', rootValue.request.file)
			.then(upload => {
				if (upload) {
					args.imageUrl = upload.imageUrl;
					args.imageId = upload.imageId;
					args.imageBucket = upload.imageBucket;
				}

				return Cloth.create(args);
			})
});

const updateCloth = mutationWithClientMutationId({
	name: 'UpdateCloth',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'cloth id'
		},
		...getClothInputs(true)
	},
	outputFields: {
		cloth: {
			type: GraphQLCloth,
			resolve: ({localId}) => Cloth.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}, context, {rootValue}) => {
		const {id: localId} = fromGlobalId(id);

		return processFileUpload('knocknock-laundry', rootValue.request.file)
			.then(upload => {
				if (upload) {
					args.imageUrl = upload.imageUrl;
					args.imageId = upload.imageId;
					args.imageBucket = upload.imageBucket;
				}

				return Cloth.findById(localId)
						.then(cloth => ({cloth, args}))
			})
			.then(({cloth, args}) => {
				if (cloth.imageId && cloth.imageBucket
					&& args.imageId && args.imageId !== cloth.imageId) {
					return deleteFile(cloth.imageBucket, cloth.imageId)
						.then(() => cloth.update(args))
						.catch(() => cloth.update(args));
				} else {
					return cloth.update(args); 
				}
			})
			.then(() => ({localId}));
	}
});

const deleteCloth = mutationWithClientMutationId({
	name: 'DeleteCloth',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'cloth id'
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

		return Cloth.findById(localId)
			.then(cloth => {
				if (cloth.imageId && cloth.imageBucket) {
					return deleteFile(cloth.imageBucket, cloth.imageId)
						.then(() => cloth)
						.catch(() => cloth);
				} else {
					return cloth;
				}
			})
			.then(cloth => cloth.destroy())
			.then(() => ({id}));
	}
});

export default {
	createCloth,
	updateCloth,
	deleteCloth
};

