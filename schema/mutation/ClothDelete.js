import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLList
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	findCLothById,
	findClothes
} from '../models';

import { GraphQLCloth } from '../query';
import { deleteFile } from '../../datastorage';

export default mutationWithClientMutationId({
	name: 'DeleteCloth',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'cloth id'
		}
	},
	outputFields: {
		clothes: {
			type: new GraphQLList(GraphQLCloth),
    	resolve: () => findClothes()
		}
	},
	mutateAndGetPayload: ({id}) => {
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
			.then(cloth => cloth.destroy());
	}
});

