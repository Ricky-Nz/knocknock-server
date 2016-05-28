import {
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	getClothInputs
} from '../models';

import { GraphQLCloth } from '../query';
import { processFileUpload } from '../service';
import { DBCloth } from '../../database';
import { deleteFile } from '../../datastorage';

export default mutationWithClientMutationId({
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
			resolve: ({localId}) => findCLothById(localId)
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

				return DBCloth.findById(localId)
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

