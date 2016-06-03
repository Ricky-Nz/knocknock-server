import {
	mutationWithClientMutationId,
	offsetToCursor
} from 'graphql-relay';

import {
	getPromoCodeInputs
} from '../models';

import {
	DBPromoCode
} from '../../database';

import {
	GraphQLViewer,
	GraphQLPromoCodeEdge,
	GraphQLPromoCode
} from '../query';

export default mutationWithClientMutationId({
	name: 'CreatePromoCode',
	inputFields: {
		...getPromoCodeInputs()
	},
	outputFields: {
		promoCodeEdge: {
			type: GraphQLPromoCodeEdge,
			resolve: (code) => ({
				cursor: offsetToCursor(0),
				node: code
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => DBPromoCode.create(args)
});
