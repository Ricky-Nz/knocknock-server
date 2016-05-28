import {
	GraphQLString,
	GraphQLNonNull
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	getClothCategoryInpts
} from '../models';

import {
	GraphQLClothCategory
} from '../query';

import {
	DBClothCategory
} from '../../database';

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
		category: {
			type: GraphQLClothCategory,
			resolve: ({localId}) => DBClothCategory.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return DBClothCategory.update(args, {where:{id:localId}})
			.then(() => ({localId}));
	}
});
