import { GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { DBOrderItem } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {

};

const mutableFields = (update) => ({
	productId: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'product id'
	},
	washType: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'wash type'
	},
	quantity: {
		type: update ? GraphQLInt : new GraphQLNonNull(GraphQLInt),
		description: 'item quantity'
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
	},
	...DBOrderItem
};

