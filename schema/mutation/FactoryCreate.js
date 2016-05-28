import {
	mutationWithClientMutationId,
	offsetToCursor,
	fromGlobalId,
} from 'graphql-relay';

import {
	getFactoryInputs
} from '../models';

import {
	DBViewer,
	DBFactory
} from '../../database';

import {
	GraphQLViewer,
	GraphQLFactoryEdge
} from '../query';

export default mutationWithClientMutationId({
	name: 'CreateFactory',
	inputFields: {
		...getFactoryInputs()
	},
	outputFields: {
		factoryEdge: {
			type: GraphQLFactoryEdge,
			resolve: (factory) => ({
				cursor: offsetToCursor(0),
				node: factory
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => DBFactory.create(args)
});
