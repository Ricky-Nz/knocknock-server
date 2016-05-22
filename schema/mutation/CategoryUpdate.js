import {
	GraphQLString,
	GraphQLNonNull
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	getClothCategoryInpts,
	updateCategory
} from '../models';

import {
	GraphQLClothCategory
} from '../query';

export default mutationWithClientMutationId({
	name: 'UpdateCategory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...getClothCategoryInpts(true)
	},
	outputFields: {
		clothCategory: {
			type: GraphQLClothCategory,
			resolve: (result) => result
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return updateCategory(localId, args);
	}
});
