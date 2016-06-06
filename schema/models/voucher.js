import { GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLFloat } from 'graphql';
import { DBVoucher } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {

};

const mutableFields = (update) => ({
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
});

export default {
	inputs: {
		...staticFields,
		...mutableFields()
	},
	updates: {
		...mutableFields(true)
	},
	fields: {
		...staticFields,
		...mutableFields(false, true),
		used: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'voucher used'
		},
		usedAt: {
			type: GraphQLString,
			description: 'voucher used date'
		},
		usedOnOrderId: {
			type: GraphQLString,
			description: 'voucher used on order id'
		}
	},
	...DBVoucher
};