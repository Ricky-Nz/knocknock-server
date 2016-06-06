import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLEnumType, GraphQLFloat } from 'graphql';
import { DBTransaction } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {

};

const mutableFields = (update) => ({

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
		walletId: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'wallet Id'
		},
		value: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'transaction value'
		},
		currency: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'value currency'
		},
		referenceNo: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'transaction reference number'
		},
		paymentMode: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'transaction payment mode'
		},
		paymentChannel: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'transaction channel'
		},
		status: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'transaction status'
		},
		createdAt: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'created at'
		}
	},
	...DBTransaction
};