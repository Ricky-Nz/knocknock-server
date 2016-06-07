import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id			
// order_id			
// item_id			
// quantity			
// laundry_type			
// price

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'OrderItem',
	  fields: {
	  	id: globalIdField('OrderItem'),
	  	orederId: {
	  		type: GraphQLString,
	  		resolve: (obj) => obj.order_id
	  	},
			productId: {
				type: GraphQLString,
				resolve: (obj) => obj.item_id
			},
			washType: {
				type: GraphQLString,
				resolve: (obj) => obj.laundry_type
			},
			quantity: {
				type: GraphQLInt,
				resolve: (obj) => obj.quantity
			},
			price: {
				type: GraphQLInt,
				resolve: (obj) => obj.price
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}