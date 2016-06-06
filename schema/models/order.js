import { GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { DBOrder } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {
	userId: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'user id'
	}
};

const mutableFields = (update) => ({
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
		description: 'pickup date'
	},
	pickupTime: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'pickup time'
	},
	pickupAddress: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString)
	},
	pickupWorkerId: {
		type: GraphQLString
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
		serialNumber: {
			type: GraphQLString,
			description: 'order readable serial number'
		},
		totalPrice: {
			type: GraphQLInt,
			description: 'total price'
		}
	},
	...DBOrder
};

