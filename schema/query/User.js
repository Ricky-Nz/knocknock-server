import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, connectionArgs, fromGlobalId } from 'graphql-relay';
import { Orders, UserAddresses, UserVouchers, UserCredits } from '../../service/database';
import { modelConnection } from '../utils';

  // { id: 3812,
  //   first_name: 'li fan',
  //   last_name: 'Lin',
  //   contact_no: '91089509',
  //   credit: '0.00',
  //   points: 0,
  //   profile_image_url_small: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/users/default_small.jpg',
  //   profile_image_url_medium: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/users/default_medium.jpg',
  //   profile_image_url_big: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/users/default_big.jpg',
  //   gender: 'female',
  //   code: 'uiR7SY',
  //   age: null,
  //   marital_status: null,
  //   have_child: null,
  //   have_maid: null,
  //   occupation: null,
  //   nationality: null,
  //   orders_count: 1,
  //   rank: null,
  //   disabled: false,
  //   first_login: true,
  //   created_on: Sun Feb 28 2016 11:33:25 GMT+0800 (SGT),
  //   email: '',
  //   encrypted_password: '$2a$10$TDlCJa2LVuhhzjtqsEkVi.NPl6XhF1.CjTINI2EQrVnomPHSkYlne',
  //   reset_password_token: null,
  //   reset_password_sent_at: null,
  //   is_imported: true,
  //   created_by: 'admin',
  //   verification_code: null,
  //   is_verified: true,
  //   birth_month: null,
  //   birth_year: null,
  //   adv_source: null,
  //   referral_code: 'yuGCvoV5',
  //   verification_code_expiry: null,
  //   stripe_customer_id: null,
  //   android_app_version: null,
  //   ios_app_version: null,
  //   plus_account: null },

export default function (nodeInterface, {
  GraphQLAddressConnection,
  GraphQLAssignedVoucherConnection,
  GraphQLCreditRecordConnection,
  GraphQLOrderConnection,
  GraphQLOrder
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
      credit: {
        type: GraphQLFloat,
        resolve: (obj) => obj.credit
      },
      points: {
        type: GraphQLInt,
        resolve: (obj) => obj.points
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
          modelConnection(UserAddresses, {where:{user_id: user.id}, order: 'created_on DESC'}, args)
      },
      order: {
        type: GraphQLOrder,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (user, {id}) => {
          const {id: localId} = fromGlobalId(id);
          return Orders.findById(localId);
        }
      },
      vouchers: {
        type: GraphQLAssignedVoucherConnection,
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
          let where = {user_id: user.id};
          if (!all) {
            where.used = false;
          }
          if (search) {
            where.title = {$like: `%${search}%`};
          }

          return modelConnection(UserVouchers, {where, order: 'created_on DESC'}, args);
        }
      },
      orders: {
        type: GraphQLOrderConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (user, {search, ...args}) => {
          let where = {user_id: user.id};
          if (search) {
            where.id = {$like: `%${search}%`};
          }

          return modelConnection(Orders, {where}, args);
        }
      },
      creditRecords: {
        type: GraphQLCreditRecordConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) => {
          const where = {user_id: obj.id};
          if (search) {
            where['$or'] = [
              {paypal_ref_no: {$like: `%${search}%`}}
            ];
          }

          return modelConnection(UserCredits, {where, order: 'created_on DESC'}, args);
        }
      }
    },
    interfaces: [nodeInterface]
  });

  return {
    nodeType,
    ...connectionDefinitions({nodeType})
  };
}

