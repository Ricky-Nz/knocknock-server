import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, toGlobalId } from 'graphql-relay';
import { toDisplayDate } from '../utils';

// { id: 381,
//   user_id: 5893,
//   stripe_card_id: 'card_18LbCHFNOwmsxf6nFg2SQX4Q',
//   brand: 'MasterCard',
//   country: 'TW',
//   cvc_check: 'pass',
//   dynamic_last4: null,
//   exp_month: 3,
//   exp_year: 2021,
//   funding: 'credit',
//   last4: '4255',
//   name: 'Cheng Chwen Jung',
//   tokenization_method: null,
//   fingerprint: '9gzX8X9BSwsRHoNj',
//   first6: '552000' }

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'CreditCard',
	  fields: {
	  	id: globalIdField('CreditCard'),
			brand: {
				type: GraphQLString,
				resolve: (obj) => obj.brand
			},
			name: {
				type: GraphQLString,
				resolve: (obj) => obj.name
			},
			asteriskNumber: {
				type: GraphQLString,
				resolve: (obj) => `xxxx xxxx xxxx ${obj.last4.slice(0, 4)}`
			},
			expireOn: {
				type: GraphQLString,
				resolve: (obj) => `${obj.exp_month}/${obj.exp_year}`
			}
		},
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}