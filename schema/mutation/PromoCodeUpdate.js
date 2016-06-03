import {
	GraphQLString,
	GraphQLNonNull
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	getPromoCodeInputs
} from '../models';

import {
	GraphQLPromoCode
} from '../query';

import {
	DBPromoCode
} from '../../database';

export default mutationWithClientMutationId({
	name: 'UpdatePromoCode',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...getPromoCodeInputs(true)
	},
	outputFields: {
		promoCode: {
			type: GraphQLPromoCode,
			resolve: ({localId}) => DBPromoCode.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return DBPromoCode.update(args, {where: {id: localId}})
			.then(() => ({localId}));
	}
});
