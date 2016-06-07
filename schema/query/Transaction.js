import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id     
// name     
// address      
// postal_code      
// contact_no     
// contact_name     
// profile_image_url_small      
// profile_image_url_medium     
// profile_image_url_big      
// created_on

const GraphQLUserReference = new GraphQLObjectType({
  name: 'UserReference',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'user id'
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'user name'
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'user email'
    }
  }
});

export default function (nodeInterface) {
  const nodeType = new GraphQLObjectType({
    name: 'Transaction',
    fields: {
      id: globalIdField('Transaction'),
      walletId: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'wallet Id'
      },
      value: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'transaction value'
      },
      currency: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'value currency'
      },
      referenceNo: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'transaction reference number'
      },
      paymentMode: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'transaction payment mode'
      },
      paymentChannel: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'transaction channel'
      },
      status: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'transaction status'
      },
      createdAt: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'created at'
      },
      user: {
        type: GraphQLUserReference,
        resolve: (transaction) =>
          Transaction.findById(transaction.walletId)
            .then(wallet => User.findById(userId))
            .then(user => ({
              id: toGlobalId('User', user.id),
              name: user.name,
              email: user.email
            }))
      }
    },
    interfaces: [nodeInterface]
  });

  return {
    nodeType,
    ...connectionDefinitions({nodeType})
  };
}
