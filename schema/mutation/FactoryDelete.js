import {
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	offsetToCursor,
	fromGlobalId,
} from 'graphql-relay';

import {
	DBViewer,
	DBFactory
} from '../../database';

import {
	GraphQLViewer
} from '../query';

export default mutationWithClientMutationId({
	name: 'DeleteFactory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'factory id'
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
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return DBFactory.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});
