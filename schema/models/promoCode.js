import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { DBPromoCode } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {
	code: {
		type: GraphQLString,
		description: 'start time'
	}
};

const mutableFields = (update) => ({
	enabled: {
		type: update ? GraphQLBoolean : new GraphQLNonNull(GraphQLBoolean),
		description: 'enabled'
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
		...mutableFields(false, true)
	},
	...DBPromoCode
};


