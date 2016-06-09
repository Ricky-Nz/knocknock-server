import { GraphQLObjectType, GraphQLList, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, connectionArgs } from 'graphql-relay';
import { Users, Workers, Admins, Items, SubCategories, OrderSlots,
  OrderStatuses, UserFeedbacks, PromotionBanners, PromoCodes, Factories, Vouchers } from '../../service/database';
import { modelConnection, formatTime } from '../utils';

export default function (nodeInterface, {
  GraphQLUser,
  GraphQLWorker,
  GraphQLAdmin,
  GraphQLCloth,
  GraphQLOrderStatus,
  GraphQLUserConnection,
  GraphQLWorkerConnection,
  GraphQLAdminConnection,
  GraphQLOrderConnection,
  GraphQLTransactionConnection,
  GraphQLClothConnection,
  GraphQLClothCategoryConnection,
  GraphQLTimeSlotTemplateConnection,
  GraphQLTimeSlotConnection,
  GraphQLFactoryConnection,
  GraphQLPromoCodeConnection,
  GraphQLVoucherConnection,
  GraphQLBannerConnection,
  GraphQLFeedbackConnection
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
        resolve: (obj, {search, ...args}) =>
          modelConnection(Admins, search?{where:{$or:[
              {first_name: {$like: `%${search}%`}},
              {last_name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact_no: {$like: `%${search}%`}}
            ]}}:{}, args)
      },
      orders: {
        type: GraphQLOrderConnection,
        args: {
          userId: {
            type: GraphQLString
          },
          search: {
            type: GraphQLString
          },
          statusIds: {
            type: new GraphQLList(GraphQLString)
          },
          afterDate: {
            type: GraphQLString
          },
          beforeDate: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {userId, search, statusIds, afterDate, beforeDate, ...args}) => {
          let where = {order_status_id:{$notIn:[8, 9]}};
          if (userId) {
            const {id: localUseriId} = fromGlobalId(userId);
            where.user_id = localUseriId;
          }
          if (search) {
            where.id = {$like: `%${search}%`};
          }
          if (statusIds&&statusIds.length > 0) {
            where.order_status_id['$in'] = statusIds;
          }
          if (afterDate) {
            where.pickup_date = {'$gte': formatTime(afterDate)};
          }
          if (beforeDate) {
            if (!where.pickup_date) {
              where.pickup_date = {};
            }
            where.pickup_date['$lt'] = formatTime(beforeDate);
          }

          return modelConnection(Order, {where}, args);
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
          let query = {where:{order_status_id: {$in: [8, 9]}}};
          if (search) {
            query.where.id = {$like: `%${search}%`};
          }

          return modelConnection(Orders, query, args);
        }
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
          let query = {where:{}};
          if (search) {
            query.where['$or'] = [
              {name_ch: {$like: `%${search}%`}},
              {name_en: {$like: `%${search}%`}}
            ];
          }
          if (categoryId) {
            const {id: localCategoryId} = fromGlobalId(categoryId);
            query.where.sub_category_id = localCategoryId;
          }

          return modelConnection(Items, query, args);
        }
      },
      categories: {
        type: GraphQLClothCategoryConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(SubCategories, search?{
            where: {$or: [
              {name_ch: {$like: `%${search}%`}},
              {name_en: {$like: `%${search}%`}},
            ]}
          }:{}, args)
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
        resolve: (obj, {search, ...args}) =>
          modelConnection(Factories, search?{where:{
            $or: [
              {name: {$like: `%${search}%`}},
              {address: {$like: `%${search}%`}},
              {contact_no: {$like: `%${search}%`}},
              {contact_name: {$like: `%${search}%`}}
            ]
          }}:{}, args)
      },
      vouchers: {
        type: GraphQLVoucherConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(Vouchers, search?{where:{
            title: {$like: `%${search}%`}
          }}:{}, args)
      },
      promoCodes: {
        type: GraphQLPromoCodeConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(PromoCodes, search?{where:{
            code: {$like: `%${search}%`}
          }}:{}, args)
      },
      banners: {
        type: GraphQLBannerConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(PromotionBanners, search?{where:{
            title: {$like: `%${search}%`}
          }, order: 'banner_order'}:{order: 'banner_order'}, args)
      },
      feedbacks: {
        type: GraphQLFeedbackConnection,
        args: {
          search: {
            type: GraphQLString
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(UserFeedbacks, search?{where:{
            comment: {$like: `%${search}%`}
          }}:{}, args)
      },
      orderStatus: {
        type: new GraphQLList(GraphQLOrderStatus),
        resolve: (obj) => OrderStatuses.findAll()
      }
    },
    interfaces: [nodeInterface]
  });

  return {
    nodeType,
    ...connectionDefinitions({nodeType})
  };
}
