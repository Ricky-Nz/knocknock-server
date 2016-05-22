import {
	GraphQLList
} from 'graphql';

import {
	mutationWithClientMutationId,
} from 'graphql-relay';

import {
	getClothCategoryInpts,
	createCategory,
	getCategories
} from '../models';

import {
	GraphQLClothCategory
} from '../query';

export default mutationWithClientMutationId({
	name: 'CreateCategory',
	inputFields: {
		...getClothCategoryInpts()
	},
	outputFields: {
		clothCategories: {
			type: new GraphQLList(GraphQLClothCategory),
			resolve: () => getCategories()
		}
	},
	mutateAndGetPayload: (args) => createCategory(args)
});
