import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { Factory } from '../models';
import { GraphQLViewer, GraphQLFactory, GraphQLFactoryEdge } from '../query';

const createFactory = mutationWithClientMutationId({
	name: 'CreateFactory',
	inputFields: {
		...Factory.inputs
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
	mutateAndGetPayload: (args) => Factory.create(args)
});

const updateFactory = mutationWithClientMutationId({
	name: 'UpdateFactory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...Factory.updates
	},
	outputFields: {
		factory: {
			type: GraphQLFactory,
			resolve: ({localId}) => Factory.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return Factory.update(args, {where: {id: localId}})
			.then(() => ({localId}));
	}
});


const deleteFactory mutationWithClientMutationId({
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
		return Factory.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});

export default {
	createFactory,
	updateFactory,
	deleteFactory
};


