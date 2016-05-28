import {
	GraphQLNonNull,
	GraphQLString,
	GraphQLBoolean,
	GraphQLFloat
} from 'graphql';

export function getVoucherInputs() {
	return {
		userId: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'user id'
		},
		title: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'voucher title'
		},
		value: {
			type: new GraphQLNonNull(GraphQLFloat),
			description: 'voucher value'
		},
		expireOn: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'voucher expire on'
		}
	};
}

export const voucherFields = {
	...getVoucherInputs(),
	used: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'voucher used'
	},
	usedOn: {
		type: GraphQLString,
		description: 'voucher used date'
	},
	usedOrderId: {
		type: GraphQLString,
		description: 'voucher used on order id'
	}
}
