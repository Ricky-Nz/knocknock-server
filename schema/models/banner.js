import { GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { DBBanner } from '../../database';
import { buildModel } from './modelCommon';

const staticFields = {

};

const mutableFields = (update) => ({
	enabled: {
		type: GraphQLBoolean,
		description: 'enabled'
	},
	title: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'banner title'
	},
	link: {
		type: GraphQLString,
		description: 'banner link'
	},
	position: {
		type: update ? GraphQLInt : new GraphQLNonNull(GraphQLInt),
		description: 'index'
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
	...DBBanner
};