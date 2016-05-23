import {
	GraphQLNonNull,
	GraphQLInt,
	GraphQLList
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId,
	offsetToCursor
} from 'graphql-relay';

import {
	getClothInputFields,
	createCloth,
	findClothes
} from '../models';

import {
	GraphQLCloth,
	GraphQLClothEdge,
	GraphQLViewer
} from '../query';

import { processFileUpload } from '../service';

export default mutationWithClientMutationId({
	name: 'CreateCloth',
	inputFields: {
		...getClothInputFields()
	},
	outputFields: {
		clothEdge: {
			type: GraphQLClothEdge,
			resolve: (newCloth) =>
				findClothes()
					.then(clothes => {
						const index = clothes.findIndex(item => item.id === newCloth.id);
						return {
							cursor: offsetToCursor(index),
							node: newCloth
						};
					})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args, context, {rootValue}) =>
		processFileUpload(args, rootValue.request.file)
			.then(args => createCloth(args))
});
