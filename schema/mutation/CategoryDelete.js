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
	GraphQLClothCategory
} from '../query';

export default mutationWithClientMutationId({
	name: 'DleteCategory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'delete item id'
		}
	},
	outputFields: {
		clothCategories: {
			type: new GraphQLList(GraphQLClothCategory),
			resolve: () => getCategories()
		}
	},
	mutateAndGetPayload: ({id}) => {
		const {id: localId} = fromGlobalId(id);
		return deleteCategory(localId)
			.then(() => ({}));
	}
});
