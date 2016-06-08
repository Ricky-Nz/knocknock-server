import { GraphQLObjectType, GraphQLList, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, connectionArgs } from 'graphql-relay';
import { Users, Workers, Admins, Items, SubCategories, DefaultDistrictTimeSlots } from '../../service/database';
import { formatToDay } from '../utils';

export default function (nodeInterface, {
  GraphQLUser,
  GraphQLWorker,
  GraphQLAdmin,
  GraphQLCloth,
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
              {name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact: {$like: `%${search}%`}}
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
              {name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact: {$like: `%${search}%`}}
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
              {name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact: {$like: `%${search}%`}}
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
          statusId: {
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
        resolve: (obj, {userId, search, status, afterDate, beforeDate, ...args}) => {
          let query = {where:{status:{$notIn:['order complete', 'deleted', 'canceled']}}};
          if (userId) {
            const {id: localUseriId} = fromGlobalId(userId);
            query.where.user_id = localUseriId;
          }
          if (search) {
            query.where.id = {$like: `%${search}%`};
          }
          if (status && status.length > 0) {
            query.where.order_status_id = {$in: status};
          }
          if (afterDate||beforeDate) query.where.pickupDate = calculateTimeRnage(afterDate, beforeDate);

          return modelConnection(Order, query, args);
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
          let query = {where:{status: {$in: ['order complete', 'deleted', 'canceled']}}};
          if (search) {
            query.where.id = {$like: `%${search}%`};
          }

          return modelConnection(Orders, query, args);
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
      clothes: {
        type: GraphQLClothConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search order by order id'
          },
          categoryId: {
            type: GraphQLString,
            description: 'category'
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
      timeSlotTemplates: {
        type: GraphQLTimeSlotTemplateConnection,
        args: {
          ...connectionArgs
        },
        resolve: (obj, args) =>
          modelConnection(DefaultDistrictTimeSlots, {order: 'start'}, args)
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
          date = formatToDay(date);
          return DefaultDistrictTimeSlots.findAll({where:{date}})
            .then(timeSlots => {
              if (timeSlots && timeSlots.length > 0) {
                return connectionFromArray(timeSlots, args);
              } else {
                return TimeSlotTemplate.findAll()
                  .then(templates => {
                    const newSlots = templates.map(template => ({
                      start: template.start,
                      end: template.end,
                      limit: template.limit,
                      date,
                      enabled: true
                    }));

                    return TimeSlot.bulkCreate(newSlots);
                  })
                  .then(() => modelConnection(TimeSlot, {where:{date}}, args));
              }
            });
        }
      },
      factories: {
        type: GraphQLFactoryConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search'
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(Factory, search?{where:{
            $or: [
              {name: {$like: `%${search}%`}},
              {address: {$like: `%${search}%`}},
              {contact: {$like: `%${search}%`}},
              {contactName: {$like: `%${search}%`}}
            ]
          }}:{}, args)
      },
      promoCodes: {
        type: GraphQLPromoCodeConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search code'
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(PromoCode, search?{where:{
            code: {$like: `%${search}%`}
          }}:{}, args)
      },
      banners: {
        type: GraphQLBannerConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search banner'
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(Banner, search?{where:{
            title: {$like: `%${search}%`}
          }, order: 'position'}:{order: 'position'}, args)
      },
      feedbacks: {
        type: GraphQLFeedbackConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search feedback'
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(Feedback, search?{where:{
            comment: {$like: `%${search}%`}
          }}:{}, args)
      },
      orderStatus: {
        type: new GraphQLList(GraphQLString),
        resolve: (obj) => ['pending worker', 'worker found', 'awaiting pick up/driver on the way',
          'picked up', 'picked up failed', 'laundry in process', 'laundry complete',
          'awaiting drop off/driver on the way', 'dropped off', 'drop off failed',
          'order complete', 'deleted', 'canceled', 'awaiting loading', 'on the way']
      }
    },
    interfaces: [nodeInterface]
  });

  return {
    nodeType,
    ...connectionDefinitions({nodeType})
  };
}
