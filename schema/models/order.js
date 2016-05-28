import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLBoolean,
	GraphQLFloat
} from 'graphql';

export function getOrderInputs(update) {
	return {
		...!update&&{
			userId: {
				type: new GraphQLNonNull(GraphQLString),
				description: 'user id'
			},
			express: {
				type: GraphQLBoolean,
				description: 'express order'
			},
			note: {
				type: GraphQLString,
				description: 'order notes'
			},
			status: {
				type: GraphQLString,
				description: 'order status'
			}
		}
	}
}

export const orderFields = {
	...getOrderInputs(),
	totalPrice: {
		type: GraphQLFloat,
		description: 'order total price'
	},
	pickupDate: {
		type: GraphQLString,
		description: 'pickup date'
	},
	pickupAddress: {
		type: GraphQLString,
		description: 'pickup address'
	}
};

