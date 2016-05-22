import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

import { DBCloth } from '../../database';
import { searchPaginationInput, resolvePagination } from './pagination';

export function getClothInputFields(update) {
	return {
		categoryId: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'category ID'
		},
		nameEn: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'english name'
		},
		nameCn: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'chinese name'
		},
		washPrice: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'normal wash price'
		},
		dryCleanPrice: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'dry clean price'
		},
		ironPrice: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'iron clean price'
		},
		washPriceDiscount: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'normal wash price discount'
		},
		dryCleanPriceDiscount: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'dry clean price discount'
		},
		ironPriceDiscount: {
			type: update ? GraphQLFloat : new GraphQLNonNull(GraphQLFloat),
			description: 'iron clean price discount'
		},
		special: {
			type: GraphQLBoolean,
			description: 'special item'
		}
	};
}

export const clothFields = {
	id: globalIdField('Cloth'),
	...getClothInputFields(),
	imageUrl: {
		type: GraphQLString,
		description: 'cloth image url'
	}
}

export function findClothes() {
	return DBCloth.findAll();
}

export function createCloth(args) {
	return DBCloth.create(args);
}

export function findCLothById(id) {
	return DBCloth.findById(id);
}


