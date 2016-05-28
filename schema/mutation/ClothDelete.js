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
	GraphQLViewer
} from '../query';

import {
	DBCloth
} from '../../database';

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

		return DBCloth.findById(localId)
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

