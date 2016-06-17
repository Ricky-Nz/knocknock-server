import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

  // { id: 595,
  //   user_id: 5057,
  //   order_ids: '[]',
  //   voucher_ids: null,
  //   promo_code_id: null,
  //   total_promo_discount: '0.00',
  //   original_amount: '29.60',
  //   payable_amount: '29.60',
  //   payment_mode: 'paypal',
  //   payment_ref_token: '5RN866641Y037764C',
  //   created_at: Sun Jun 05 2016 16:26:12 GMT+0800 (SGT),
  //   total_voucher_amount: '0.00' },

export default function (nodeInterface) {
  const nodeType = new GraphQLObjectType({
    name: 'Transaction',
    fields: {
      id: globalIdField('Transaction'),
      originalAmount: {
        type: GraphQLFloat,
        resolve: (obj) => obj.original_amount
      },
      payableAmount: {
        type: GraphQLFloat,
        resolve: (obj) => obj.payable_amount
      },
      referenceNo: {
        type: GraphQLString,
        resolve: (obj) => obj.payment_ref_token
      },
      paymentMode: {
        type: GraphQLString,
        resolve: (obj) => obj.payment_mode
      },
      createdAt: {
        type: GraphQLString,
        resolve: (obj) => obj.created_at
      }
    },
    interfaces: [nodeInterface]
  });

  return {
    nodeType,
    ...connectionDefinitions({nodeType})
  };
}
