import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

// id      
// first_name      
// last_name     
// contact_no      
// credit      
// points      
// profile_image_url_small     
// profile_image_url_medium      
// profile_image_url_big     
// gender      
// code      
// age     
// marital_status      
// have_child      
// have_maid     
// occupation      
// nationality     
// orders_count      
// rank      
// disabled      
// first_login     
// created_on      
// email     
// encrypted_password      
// reset_password_token      
// reset_password_sent_at      
// is_imported     
// created_by      
// verification_code     
// is_verified     
// birth_month     
// birth_year      
// adv_source      
// referral_code     
// verification_code_expiry      
// stripe_customer_id      
// android_app_version     
// ios_app_version     
// plus_account

export default function (nodeInterface, {
  GraphQLAddressConnection,
  GraphQLVoucherConnection,
  GraphQLTransactionConnection,
  GraphQLOrderConnection,
  GraphQLOrder,
  GraphQLWallet
}) {
  const nodeType = new GraphQLObjectType({
    name: 'User',
    fields: {
      id: globalIdField('User'),
      email: {
        type: GraphQLString,
        resolve: (obj) => obj.email
      },
      firstName: {
        type: GraphQLString,
        resolve: (obj) => obj.first_name
      },
      lastName: {
        type: GraphQLString,
        resolve: (obj) => obj.last_name
      },
      contact: {
        type: GraphQLString,
        resolve: (obj) => obj.contact_no
      },
      enabled: {
        type: GraphQLBoolean,
        resolve: (obj) => !obj.disabled
      },
      avatarUrl: {
        type: GraphQLString,
        resolve: (obj) => obj.profile_image_url_small
      },
      isVerified: {
        type: GraphQLBoolean,
        resolve: (obj) => obj.is_verified
      },
      addresses: {
        type: GraphQLAddressConnection,
        args: {
          ...connectionArgs
        },
        resolve: (user, args) =>
          modelConnection(Address, {where:{userId: toGlobalId('User', user.id)}}, args)
      },
      vouchers: {
        type: GraphQLVoucherConnection,
        args: {
          all: {
            type: GraphQLBoolean,
            description: 'show all voucher include used voucher'
          },
          search: {
            type: GraphQLString,
            description: 'search order by order id'
          },
          ...connectionArgs
        },
        resolve: (user, {all, search, ...args}) => {
          const userId = toGlobalId('User', user.id);

          let query = {where:{userId}};
          if (!all) {
            query.where.used = false;
          }
          if (search) {
            query.where.title = {$like: `%${search}%`};
          }

          return modelConnection(Voucher, query, args);
        }
      },
      order: {
        type: GraphQLOrder,
        args: {
          serialNumber: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'order id'
          }
        },
        resolve: (obj, {serialNumber}) => Order.findOne({where:{serialNumber}})
      },
      orders: {
        type: GraphQLOrderConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search order by order id'
          },
          ...connectionArgs
        },
        resolve: (user, {search, ...args}) => {
          const userId = toGlobalId('User', user.id);
          return modelConnection(Order, {where: search?{userId, $or: [
              {id: {$like: `%${search}%`}}
            ]}:{userId}}, args);
        }
      },
      transactions: {
        type: GraphQLTransactionConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search order by order id'
          },
          ...connectionArgs
        },
        resolve: (user, {search, ...args}) => {
          const userId = toGlobalId('User', user.id);
          return Wallet.findOne({where:{userId}})
            .then(wallet => modelConnection(Transaction, {
              where: {
                walletId: toGlobalId('Wallet', wallet.id),
                ...(search?{referenceNo: {$like: `%${search}%`}}:{})
              }
            }, args));
        }
      },
      wallet: {
        type: GraphQLWallet,
        resolve: (user) => Wallet.findOne({where:{userId:toGlobalId('User', user.id)}})
      }
    },
    interfaces: [nodeInterface]
  });

  return {
    nodeType,
    ...connectionDefinitions({nodeType})
  };
}

