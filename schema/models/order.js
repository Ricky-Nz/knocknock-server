import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt
} from 'graphql';

export function getOrderItemInputs() {
	return {
		orderId: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'order id'
		},
		productId: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'product id'
		},
		washType: {
			type: GraphQLString,
			description: 'wash type'
		},
		itemPrice: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'item price'
		},
		itemNameCn: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'item chinese name'
		},
		itemNameEn: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'item english name'
		},
		itemImageUrl: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'item imageurl'
		},
		quantity: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'item quantity'
		}
	};
}

export const orderItemFields = {
	...getOrderItemInputs()
};

export function getOrderInputs(update) {
	return {
		...!update&&{
			userId: {
				type: new GraphQLNonNull(GraphQLString),
				description: 'user id'
			},
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
		},
		pickupDate: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString)
		},
		pickupTime: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString)
		},
		pickupAddress: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString)
		},
		pickupWorkerId: {
			type: GraphQLString
		}
	};
}

export const orderFields = {
	...getOrderInputs(),
	totalPrice: {
		type: GraphQLInt,
		description: 'total price'
	}
};

