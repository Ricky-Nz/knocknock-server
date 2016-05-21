import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLFloat,
	GraphQLBoolean,
	GraphQLInt
} from 'graphql';

import {
	mutationWithClientMutationId,
	offsetToCursor,
	fromGlobalId
} from 'graphql-relay';

import {
	GraphQLViewer,
	GraphQLClothEdge,
	GraphQLClothPagination,
	GraphQLCloth,
	resolvePagination
} from '../query';

import { DBLaundryCloth } from '../../database';
import { uploadFile, deleteFile } from '../../datastorage';
import path from 'path';
import fs from 'fs';

function getClothInputFields (update) {
	return {
		nameEn: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'english name'
		},
		nameCn: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'chinese name'
		},
		washPrice: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'normal wash price'
		},
		dryCleanPrice: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'dry clean price'
		},
		ironPrice: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'iron clean price'
		},
		washPriceDiscount: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'normal wash price discount'
		},
		dryCleanPriceDiscount: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'dry clean price discount'
		},
		ironPriceDiscount: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'iron clean price discount'
		},
		special: {
			type: GraphQLBoolean,
			description: 'special item'
		}
	};
}

function prepareFileParams (args, file) {
	return new Promise((resolve, reject) => {
		if (!file) return resolve(args);

		const localFilePath = path.join(__dirname, '..', '..', file.path);

		uploadFile('knocknock-laundry', localFilePath)
			.then(file => {
				fs.unlink(localFilePath);
				
				const imageBucket = file.metadata.bucket;
				const imageId = file.id;
				const imageUrl = `https://storage.googleapis.com/${imageBucket}/${imageId}`
				resolve({...args, imageUrl, imageBucket, imageId});
			})
			.catch(err => reject(err));
	});
}

export const CreateCloth = mutationWithClientMutationId({
	name: 'CreateCloth',
	inputFields: {
		limit: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'refeach limit'
		},
		...getClothInputFields()
	},
	outputFields: {
		clothPage: {
			type: GraphQLClothPagination,
			resolve: ({newCloth, limit}) =>
				resolvePagination(DBLaundryCloth, null, 1, limit)
		}
	},
	mutateAndGetPayload: ({limit, ...args}, context, {rootValue}) =>
		prepareFileParams(args, rootValue.request.file)
			.then(args => DBLaundryCloth.create(args))
			.then(newCloth => ({newCloth, limit}))
});

export const UpdateCloth = mutationWithClientMutationId({
	name: 'UpdateCloth',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'cloth id'
		},
		...getClothInputFields(true)
	},
	outputFields: {
		cloth: {
			type: GraphQLCloth,
			resolve: (result) => result
		}
	},
	mutateAndGetPayload: ({id, ...args}, context, {rootValue}) => {
		const {type, id: localId} = fromGlobalId(id);

		return prepareFileParams(args, rootValue.request.file)
			.then(args => DBLaundryCloth.findById(localId))
			.then(cloth => {
				if (cloth.imageId && cloth.imageBucket
					&& args.imageId && args.imageId !== cloth.imageId) {
					return deleteFile(cloth.imageBucket, cloth.imageId)
						.then(() => cloth.update(args));
				} else {
					return cloth.update(args); 
				}
			});
	}
});

export const DeleteCloth = mutationWithClientMutationId({
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
		}
	},
	mutateAndGetPayload: ({id}) => {
		const {type, id: localId} = fromGlobalId(id);

		return DBLaundryCloth.findById(localId)
			.then(cloth => {
				if (cloth.imageId && cloth.imageBucket) {
					return deleteFile(cloth.imageBucket, cloth.imageId)
						.then(() => cloth);
				} else {
					return cloth;
				}
			})
			.then(cloth => cloth.destroy())
			.then(() => ({id}));
	}
});

