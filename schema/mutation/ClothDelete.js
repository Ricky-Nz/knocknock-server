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
	searchPaginationArgs,
	resolveClothPagination
} from '../models';

import { GraphQLClothPagination } from '../query';
import { deleteFile } from '../../datastorage';

export default mutationWithClientMutationId({
	name: 'DeleteCloth',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'cloth id'
		},
		...searchPaginationArgs
	},
	outputFields: {
		clothPage: {
			type: GraphQLClothPagination,
    	resolve: resolveClothPagination
		}
	},
	mutateAndGetPayload: ({id, ...fetchArgs}) => {
		const {id: localId} = fromGlobalId(id);

		return findCLothById(localId)
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
			.then(() => fetchArgs);
	}
});

