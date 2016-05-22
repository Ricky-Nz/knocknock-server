import {
	GraphQLNonNull,
	GraphQLInt
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	getClothInputFields,
	resolveClothPagination,
	createCloth
} from '../models';

import { processFileUpload } from '../service';
import { GraphQLClothPagination } from '../query';

export default mutationWithClientMutationId({
	name: 'CreateCloth',
	inputFields: {
		limit: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'refeach limit'
		},
		...getClothInputFields()
	},
	outputFields: {
		clothPage: {
			type: GraphQLClothPagination,
			resolve: ({limit}) =>
				resolveClothPagination(null, {page: 1, limit})
		}
	},
	mutateAndGetPayload: ({limit, ...args}, context, {rootValue}) => {
		const {id: localId} = fromGlobalId(args.categoryId);
		
		return processFileUpload(args, rootValue.request.file)
			.then(args => createCloth({...args, categoryId: localId}))
			.then(newCloth => ({limit}))
	}
});
