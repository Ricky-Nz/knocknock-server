import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { Vouchers } from '../../service/database';

  // { id: 7549,
  //   user_id: 1263,
  //   voucher_id: 796,
  //   used: true,
  //   created_on: Wed May 25 2016 18:10:00 GMT+0800 (SGT) },

export default function (nodeInterface, {GraphQLVoucher}) {
	const nodeType = new GraphQLObjectType({
	  name: 'AssignedVoucher',
	  fields: {
	  	id: globalIdField('AssignedVoucher'),
			used: {
				type: GraphQLBoolean,
				resolve: (obj) => obj.used
			},
			createdAt: {
				type: GraphQLString,
				resolve: (obj) => obj.created_on
			},
			voucher: {
				type: GraphQLVoucher,
				resolve: (obj) => Vouchers.findById(obj.voucher_id)
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}