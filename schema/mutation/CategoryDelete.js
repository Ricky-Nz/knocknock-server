import {
	GraphQLList,
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	deleteCategory,
	getCategories
} from '../models';

import {
	GraphQLClothCategory,
	GraphQLViewer
} from '../query';

export default mutationWithClientMutationId({
	name: 'DeleteCategory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'delete item id'
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
		return deleteCategory(localId)
			.then(() => ({id}));
	}
});
