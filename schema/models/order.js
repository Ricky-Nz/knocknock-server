import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt
} from 'graphql';
import moment from 'moment';

export function getOrderItemInputs() {
	return {
		productId: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'product id'
		},
		washType: {
			type: GraphQLString,
			description: 'wash type'
		},
		quantity: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'item quantity'
		}
	};
}

export const orderItemFields = {
	...getOrderItemInputs(),
	serialNumber: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'order readable serial number'
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
	}
};

export function getOrderInputs(update, resolve) {
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
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			...resolve&&{
				resolve: (order) => moment(order.pickupDate).format('MMM Do YYYY')
			}
		},
		pickupTime: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			...resolve&&{
				resolve: (order) => {
					const slot = order.pickupTime.split('~');
					return `${slot[0]}:00 ~ ${slot[1]}:00`;
				}
			}
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
	...getOrderInputs(false, true),
	serialNumber: {
		type: GraphQLString,
		description: 'order readable serial number'
	},
	totalPrice: {
		type: GraphQLInt,
		description: 'total price'
	}
};

