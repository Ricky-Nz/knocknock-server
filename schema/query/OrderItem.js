import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

   // { id: 239,
   //   order_id: 117,
   //   item_id: 1,
   //   quantity: 1,
   //   laundry_type: 'wash',
   //   price: '2.90' },

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