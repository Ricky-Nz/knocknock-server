import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} from 'graphql';

import {
	globalIdField
} from 'graphql-relay';

import { DBClothCategory } from '../../database';

export function getClothCategoryInpts(update) {
	return {
		nameCn: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'chinese name'
		},
		nameEn: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'english name'
		}
	};
}

export const clothCategoryFields = {
	id: globalIdField('Cloth'),
	...getClothCategoryInpts(),
	count: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'items count belong to this category'
	}
};

export function createCategory(args) {
	return DBClothCategory.create(args);
}

export function updateCategory(id, args) {
	return DBClothCategory.update({id}, args);
}

export function getCategories() {
	return DBClothCategory.findAll();
}

export function deleteCategory(id) {
	return DBClothCategory.destroy({where: {id}});
}