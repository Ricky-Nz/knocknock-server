import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, toGlobalId } from 'graphql-relay';
import { Items } from '../../service/database';

   // { id: 239,
   //   order_id: 117,
   //   item_id: 1,
   //   quantity: 1,
   //   laundry_type: 'wash',
   //   price: '2.90' },

export default function (nodeInterface, {GraphQLCloth}) {
	const nodeType = new GraphQLObjectType({
	  name: 'OrderItem',
	  fields: {
	  	id: globalIdField('OrderItem'),
	  	orederId: {
	  		type: GraphQLString,
	  		resolve: (obj) => toGlobalId('Order', obj.order_id)
	  	},
			productId: {
				type: GraphQLString,
				resolve: (obj) => toGlobalId('Cloth', obj.item_id)
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
				type: GraphQLFloat,
				resolve: (obj) => obj.price
			},
			cloth: {
				type: GraphQLCloth,
				resolve: (obj) => Items.findById(obj.item_id)
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}