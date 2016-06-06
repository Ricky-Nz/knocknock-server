import { GraphQLNonNull, GraphQLString } from 'graphql';
import { DBAdmin } from '../../service/database';
import { buildModel } from './modelCommon';

const staticFields = {
	email: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'user login email'
	}
};

const mutableFields = (update, filterOut) => ({
	name: {
		type: GraphQLString,
		description: 'user name'
	},
	contact: {
		type: GraphQLString,
		description: 'contact phone number'
	},
	...!filterOut&&{
		password: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
			description: 'login password'
		}
	}
});

export default buildModel(staticFields, mutableFields, null, {
	
});
export default {
	inputs: {
		...staticFields,
		...mutableFields()
	},
	updates: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...mutableFields(true)
	},
	fields: {
		...staticFields,
		...mutableFields(false, true)
	},
	...DBAdmin
};

