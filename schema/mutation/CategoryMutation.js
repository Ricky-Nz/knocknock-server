import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import { ClothCategory } from '../models';
import { GraphQLClothCategory, GraphQLClothCategoryEdge, GraphQLViewer } from '../query';

const createCategory = mutationWithClientMutationId({
	name: 'CreateCategory',
	inputFields: {
		...ClothCategory.inputs
	},
	outputFields: {
		categoryEdge: {
			type: GraphQLClothCategoryEdge,
			resolve: (newCategory) => ({
				cursor: offsetToCursor(0),
				node: newCategory
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => ClothCategory.create(args)
});

const updateCategory = mutationWithClientMutationId({
	name: 'UpdateCategory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...ClothCategory.updates
	},
	outputFields: {
		category: {
			type: GraphQLClothCategory,
			resolve: ({localId}) => ClothCategory.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return ClothCategory.update(args, {where:{id:localId}})
			.then(() => ({localId}));
	}
});

const deleteCategory = mutationWithClientMutationId({
	name: 'DeleteCategory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'delete item id'
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
		return ClothCategory.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});

export default {
	createCategory,
	updateCategory,
	deleteCategory
};

