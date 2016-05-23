import {
	GraphQLList
} from 'graphql';

import {
	mutationWithClientMutationId,
	offsetToCursor
} from 'graphql-relay';

import {
	getClothCategoryInpts,
	createCategory,
	getCategories
} from '../models';

import {
	GraphQLClothCategory,
	GraphQLClothCategoryEdge,
	GraphQLViewer
} from '../query';

export default mutationWithClientMutationId({
	name: 'CreateCategory',
	inputFields: {
		...getClothCategoryInpts()
	},
	outputFields: {
		categoryEdge: {
			type: GraphQLClothCategoryEdge,
			resolve: (newCategory) =>
				getCategories()
					.then(categories => {
						const index = categories.findIndex(item => item.id === newCategory.id);
						return {
							cursor: offsetToCursor(index),
							node: newCategory
						};
					})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => createCategory(args)
});
