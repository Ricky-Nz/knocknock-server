import {
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	DBPromoCode
} from '../../database';

import {
	GraphQLViewer
} from '../query';

export default mutationWithClientMutationId({
	name: 'DeletePromoCode',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'code id'
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
		return DBPromoCode.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});
