import {
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	findCLothById,
	getClothInputFields
} from '../models';

import { GraphQLCloth } from '../query';
import { processFileUpload } from '../service';
import { deleteFile } from '../../datastorage';

export default mutationWithClientMutationId({
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
		const {id: localId} = fromGlobalId(id);
		if (args.categoryId) {
			const {id: categoryId} = fromGlobalId(args.categoryId);

			args = {...args, categoryId};
		}

		return processFileUpload(args, rootValue.request.file)
			.then(args =>
					findCLothById(localId)
						.then(cloth => ({cloth, args}))
			)
			.then(({cloth, args}) => {
				if (cloth.imageId && cloth.imageBucket
					&& args.imageId && args.imageId !== cloth.imageId) {
					return deleteFile(cloth.imageBucket, cloth.imageId)
						.then(() => cloth.update(args))
						.catch(() => cloth.update(args));
				} else {
					return cloth.update(args); 
				}
			});
	}
});

