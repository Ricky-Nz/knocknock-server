import { GraphQLObjectType, GraphQLList, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, fromGlobalId, connectionArgs } from 'graphql-relay';
import { Users, Orders, Workers, Admins, Items, SubCategories, OrderSlots, UserCredits,
  OrderStatuses, UserFeedbacks, PromotionBanners, PromoCodes, Factories, Vouchers } from '../../service/database';
import { getAddressByPostalCode } from '../../service/location';
import { modelConnection, formatSelectDate } from '../utils';

export default function (nodeInterface, {
  GraphQLUser,
  GraphQLWorker,
  GraphQLAdmin,
  GraphQLCloth,
  GraphQLVoucher,
  GraphQLOrderStatus,
  GraphQLUserConnection,
  GraphQLWorkerConnection,
  GraphQLAdminConnection,
  GraphQLOrderConnection,
  GraphQLClothConnection,
  GraphQLCategoryConnection,
  GraphQLTimeSlotTemplateConnection,
  GraphQLTimeSlotConnection,
  GraphQLFactoryConnection,
  GraphQLPromoCodeConnection,
  GraphQLVoucherConnection,
  GraphQLBannerConnection,
  GraphQLFeedbackConnection,
  GraphQLCreditRecordConnection
}) {
  const nodeType = new GraphQLObjectType({
    name: 'Viewer',
    fields: {
      id: globalIdField('Viewer', () => 'VIEWER'),
      user: {
        type: GraphQLUser,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (obj, {id}) => {
          const {id: localId} = fromGlobalId(id);
          return Users.findById(localId);
        }
      },
      worker: {
        type: GraphQLWorker,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (obj, {id}) => {
          const {id: localId} = fromGlobalId(id);
          return Workers.findById(localId);
        }
      },
      admin: {
        type: GraphQLAdmin,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (obj, {id}) => {
          const {id: localId} = fromGlobalId(id);
          return Admins.findById(localId);
        }
      },
      cloth: {
        type: GraphQLCloth,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (obj, {id}) => {
          const {id: localId} = fromGlobalId(id);
          return Items.findById(localId);
        }
      },
      voucher: {
        type: GraphQLVoucher,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (obj, {id}) => {
          const {id: localId} = fromGlobalId(id);
          return Vouchers.findById(localId);
        }
      },
      users: {
        type: GraphQLUserConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(Users, search?{where:{$or:[
              {first_name: {$like: `%${search}%`}},
              {last_name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact_no: {$like: `%${search}%`}}
            ]}}:{}, args)
      },
      workers: {
        type: GraphQLWorkerConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(Workers, search?{where:{$or:[
              {first_name: {$like: `%${search}%`}},
              {last_name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact_no: {$like: `%${search}%`}}
            ]}}:{}, args)
      },
      admins: {
        type: GraphQLAdminConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) => {
          let where = {}
          if (search) {
            where['$or'] = [
              {first_name: {$like: `%${search}%`}},
              {last_name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact_no: {$like: `%${search}%`}}
            ];
          }
          return modelConnection(Admins, {where, order: 'created_on DESC'}, args);
        }
      },
      orders: {
        type: GraphQLOrderConnection,
        args: {
          year: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          month: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          dayOfMonth: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve: (obj, {year, month, dayOfMonth}) => {
          const { start, end } = formatSelectDate(year, month, dayOfMonth);
          let where = {$or: [
            {order_status_id: 1, pickup_date: {$gte: start, $lt: end}},
            {order_status_id: 6, drop_off_date: {$gte: start, $lt: end}}
          ]};

          return modelConnection(Orders, {where, order: 'id DESC'}, {first: 1000});
        }
      },
      histories: {
        type: GraphQLOrderConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) => {
          let where = {order_status_id: {$in: [8, 9]}};
          if (search) {
            where.id = search;
          }

          return modelConnection(Orders, {where, order: 'id DESC'}, args);
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
        resolve: (obj, {search, ...args}) =>
          modelConnection(UserCredits, search?{where:{$or:[
              {paypal_ref_no: {$like: `%${search}%`}}
            ]}, order: 'created_on DESC'}:{order: 'created_on DESC'}, args)
      },
      clothes: {
        type: GraphQLClothConnection,
        args: {
          search: {
            type: GraphQLString
          },
          categoryId: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, categoryId, ...args}) => {
          let where = {};
          if (search) {
            where['$or'] = [
              {name_ch: {$like: `%${search}%`}},
              {name_en: {$like: `%${search}%`}}
            ];
          }
          if (categoryId) {
            const {id: localCategoryId} = fromGlobalId(categoryId);
            where.sub_category_id = localCategoryId;
          }

          return modelConnection(Items, {where, order: 'created_on DESC'}, args);
        }
      },
      categories: {
        type: GraphQLCategoryConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) => {
          let where = {};
          if (search) {
            where['$or'] = [
              {name_ch: {$like: `%${search}%`}},
              {name_en: {$like: `%${search}%`}}
            ];
          }

          return modelConnection(SubCategories, {where, order: 'created_on DESC'}, args);
        }
      },
      timeSlots: {
        type: GraphQLTimeSlotConnection,
        args: {
          date: {
            type: new GraphQLNonNull(GraphQLString)
          },
          ...connectionArgs
        },
        resolve: (obj, {date, ...args}) => {
          date = formatTime(date, 8);
          return modelConnection(OrderSlots, {where:{date}}, args);
        }
      },
      factories: {
        type: GraphQLFactoryConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) => {
          let where = {};
          if (search) {
            where['$or'] = [
              {name: {$like: `%${search}%`}},
              {contact_no: {$like: `%${search}%`}},
              {contact_name: {$like: `%${search}%`}}
            ];
          }

          return modelConnection(Factories, {where, order: 'created_on DESC'}, args);
        }
      },
      vouchers: {
        type: GraphQLVoucherConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) => {
          const order = 'created_on DESC';
          const where = {};
          if (search) {
            where.title = {$like: `%${search}%`};
          }

          return modelConnection(Vouchers, {where, order}, args);
        }
      },
      promoCodes: {
        type: GraphQLPromoCodeConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) => {
          const order = 'created_at DESC';
          const where = {};
          if (search) {
            where.name = {$like: `%${search}%`};
          }

          return modelConnection(PromoCodes, {where, order}, args);
        }
      },
      banners: {
        type: GraphQLBannerConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) => {
          const where = {};
          const order = [
            ['is_enabled', 'DESC'],
            ['banner_order']
          ];

          if (search) {
            where.banner_title = {$like: `%${search}%`};
          }

          return modelConnection(PromotionBanners, {where, order}, args);
        }
      },
      feedbacks: {
        type: GraphQLFeedbackConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) => {
          const order = 'created DESC';
          const where = {};
          if (search) {
            where.comment = {$like: `%${search}%`};
          }

          return modelConnection(UserFeedbacks, {where, order}, args);
        }
      },
      orderStatus: {
        type: new GraphQLList(GraphQLOrderStatus),
        resolve: (obj) => OrderStatuses.findAll()
      },
      address: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          postalCode: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (obj, {postalCode}) => getAddressByPostalCode(postalCode)
      }
    },
    interfaces: [nodeInterface]
  });

  return {
    nodeType,
    ...connectionDefinitions({nodeType})
  };
}
