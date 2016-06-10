import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLCategory, GraphQLCategoryEdge, GraphQLViewer } from '../query';
import { SubCategories } from '../../service/database';
import { updateField } from '../utils';

// id			
// category_id			
// name_en			
// name_ch			
// items_count			
// created_on			
// image_url			
// item_order

const createCategory = mutationWithClientMutationId({
	name: 'CreateCategory',
	inputFields: {
		nameCn: {
			type: new GraphQLNonNull(GraphQLString)
		},
		nameEn: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		categoryEdge: {
			type: GraphQLCategoryEdge,
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
	mutateAndGetPayload: ({nameEn, nameCn}) =>
		SubCategories.create({
			name_ch: nameCn,
			name_en: nameEn,
			created_on: new Date()
		})
});

const updateCategory = mutationWithClientMutationId({
	name: 'UpdateCategory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		},
		nameCn: {
			type: GraphQLString
		},
		nameEn: {
			type: GraphQLString
		}
	},
	outputFields: {
		category: {
			type: GraphQLCategory,
			resolve: ({localId}) => SubCategories.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, nameEn, nameCn}) => {
		const {id: localId} = fromGlobalId(id);
		return SubCategories.update({
			...updateField('name_en', nameEn),
			...updateField('name_ch', nameCn)
		}, {where:{id:localId}}).then(() => ({localId}));
	}
});

const deleteCategory = mutationWithClientMutationId({
	name: 'DeleteCategory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
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
		return SubCategories.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});

export default {
	createCategory,
	updateCategory,
	deleteCategory
};

