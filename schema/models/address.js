import { GraphQLNonNull, GraphQLString } from 'graphql';
import { DBAddress } from '../../service/database';
import { buildModel } from './modelCommon';

const staticFields = {
	userId: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'user id'
	}
};

const mutableFields = (update) => ({
	postalCode: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'address postal code'
	},
	address: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'address detail'
	},
	contact: {
		type: update ? GraphQLString : new GraphQLNonNull(GraphQLString),
		description: 'contact phone number'
	}
});

export default buildModel(staticFields, mutableFields, null, {
	
});