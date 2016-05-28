import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} from 'graphql';

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
	...getClothCategoryInpts(),
	count: {
		type: GraphQLInt,
		description: 'items count belong to this category'
	}
};