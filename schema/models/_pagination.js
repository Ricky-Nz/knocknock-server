import {
	GraphQLNonNull,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLObjectType
} from 'graphql';

export const searchPaginationInput = {
	search: {
		type: GraphQLString,
		description: 'search'
	},
	page: {
		type: GraphQLInt,
		description: 'page index'
	},
	limit: {
		type: GraphQLInt,
		description: 'each page size'
	}
};

export const GraphQLPagination = new GraphQLObjectType({
	name: 'Pagination',
	fields: {
		...searchPaginationInput,
		totalPage: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'total page count'
		}
	}
});

export function resolvePagination(dbClass, selection, page, limit) {
	let query = {
		order: 'updatedAt DESC',
		offset: (page - 1) * limit,
		limit
	};

	if (selection) query.where = selection;

	return dbClass.findAndCountAll(query)
		.then(({count, rows}) => {
			const totalPage = Math.ceil(count / limit);
			return {
				pagination: {
					totalPage,
					page,
					limit
				},
				datas: rows
			};
		});
}