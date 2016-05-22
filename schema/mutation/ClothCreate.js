import {
	GraphQLNonNull,
	GraphQLInt,
	GraphQLList
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	getClothInputFields,
	createCloth,
	findClothes
} from '../models';

import { processFileUpload } from '../service';
import { GraphQLCloth } from '../query';

export default mutationWithClientMutationId({
	name: 'CreateCloth',
	inputFields: {
		...getClothInputFields()
	},
	outputFields: {
		clothes: {
			type: new GraphQLList(GraphQLCloth),
			resolve: () => findClothes()
		}
	},
	mutateAndGetPayload: (args, context, {rootValue}) => {
		const {id: localId} = fromGlobalId(args.categoryId);
		
		return processFileUpload(args, rootValue.request.file)
			.then(args => createCloth({...args, categoryId: localId}));
	}
});
