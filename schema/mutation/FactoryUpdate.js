import {
	GraphQLString,
	GraphQLNonNull
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	getFactoryInputs
} from '../models';

import {
	GraphQLFactory
} from '../query';

import {
	DBFactory
} from '../../database';

export default mutationWithClientMutationId({
	name: 'UpdateFactory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...getFactoryInputs(true)
	},
	outputFields: {
		factory: {
			type: GraphQLFactory,
			resolve: ({localId}) => DBFactory.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return DBFactory.update(args, {where: {id: localId}})
			.then(() => ({localId}));
	}
});
