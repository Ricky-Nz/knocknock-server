import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { toDisplayDate } from '../utils';

  // { id: 855,
  //   title: 'KnocKnocK Voucher',
  //   value: '5.00',
  //   expire_on: Sat Jun 18 2016 08:00:00 GMT+0800 (SGT),
  //   created_on: Sat Jun 04 2016 20:23:39 GMT+0800 (SGT),
  //   disabled: false,

export default function (nodeInterface) {
	const nodeType = new GraphQLObjectType({
	  name: 'Voucher',
	  fields: {
	  	id: globalIdField('Voucher'),
			title: {
				type: GraphQLString,
				resolve: (obj) => obj.title
			},
			value: {
				type: GraphQLFloat,
				resolve: (obj) => obj.value
			},
			displayExpireOn: {
				type: GraphQLString,
				resolve: (obj) => toDisplayDate(obj.expire_on)
			},
			expireOn: {
				type: GraphQLString,
				resolve: (obj) => obj.expire_on
			},
			enabled: {
				type: GraphQLBoolean,
				resolve: (obj) => !obj.disabled
			},
			createdAt: {
				type: GraphQLString,
				resolve: (obj) => obj.created_on
			}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}