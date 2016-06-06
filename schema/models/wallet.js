import { GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';
import { DBWallet } from '../../database';
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
		credit: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'wallet credit'
		},
		freeze: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'freeze'
		}
	},
	...DBWallet
};