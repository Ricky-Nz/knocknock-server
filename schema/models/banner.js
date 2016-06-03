import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt
} from 'graphql';

export function getBannerInputs(update) {
	return {
		enabled: {
			type: GraphQLBoolean,
			description: 'enabled'
		},
		title: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'banner title'
		},
		link: {
			type: GraphQLString,
			description: 'banner link'
		},
		position: {
			type: GraphQLInt,
			description: 'index'
		}
	};
}

export const bannerFields = {
	...getBannerInputs(),
	imageUrl: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'image url'
	}
};