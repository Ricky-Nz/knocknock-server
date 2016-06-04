import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} from 'graphql';

export function getPromoCodeInputs(update) {
	return {
		enabled: {
			type: update ? GraphQLBoolean : new GraphQLNonNull(GraphQLBoolean),
			description: 'enabled'
		},
		...!update&&{
			code: {
				type: GraphQLString,
				description: 'start time'
			}
		},
		name: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'start time'
		},
		description: {
			type: GraphQLString,
			description: 'end time'
		},
		start: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'enabled'
		},
		end: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'enabled'
		},
		perUserLimit: {
			type: update ? GraphQLInt : new GraphQLNonNull(GraphQLInt),
			description: 'enabled'
		},
		limit: {
			type: update ? GraphQLInt : new GraphQLNonNull(GraphQLInt),
			description: 'enabled'
		},
		promoType: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'enabled'
		},
		promoValue: {
			type: update ? GraphQLInt : new GraphQLNonNull(GraphQLInt),
			description: 'enabled'
		},
		amount: {
			type: update ? GraphQLInt : new GraphQLNonNull(GraphQLInt),
			description: 'enabled'
		},
		multipleUse: {
			type: update ? GraphQLBoolean : new GraphQLNonNull(GraphQLBoolean),
			description: 'enabled'
		},
		mobileOnly: {
			type: update ? GraphQLBoolean : new GraphQLNonNull(GraphQLBoolean),
			description: 'enabled'
		},
		firstTimeUser: {
			type: update ? GraphQLBoolean : new GraphQLNonNull(GraphQLBoolean),
			description: 'enabled'
		}
	};
}

export const promoCodeFields = {
	...getPromoCodeInputs()
};

