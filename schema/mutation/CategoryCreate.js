import {
	GraphQLList
} from 'graphql';

import {
	mutationWithClientMutationId,
	offsetToCursor
} from 'graphql-relay';

import {
	getClothCategoryInpts
} from '../models';

import {
	GraphQLClothCategory,
	GraphQLClothCategoryEdge,
	GraphQLViewer
} from '../query';

import {
	DBClothCategory
} from '../../database';

export default mutationWithClientMutationId({
	name: 'CreateCategory',
	inputFields: {
		...getClothCategoryInpts()
	},
	outputFields: {
		categoryEdge: {
			type: GraphQLClothCategoryEdge,
			resolve: (newCategory) => ({
				cursor: offsetToCursor(0),
				node: newCategory
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => DBClothCategory.create(args)
});
