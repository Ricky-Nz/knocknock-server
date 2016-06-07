import { GraphQLObjectType, GraphQLList, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, connectionArgs } from 'graphql-relay';

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
            type: new GraphQLNonNull(GraphQLString),
            description: 'user id'
          }
        },
        resolve: (obj, {id}) => {
          const {id: localId} = fromGlobalId(id);
          return User.findById(localId);
        }
      },
      worker: {
        type: GraphQLWorker,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'worker id'
          }
        },
        resolve: (obj, {id}) => {
          const {id: localId} = fromGlobalId(id);
          return Worker.findById(localId);
        }
      },
      admin: {
        type: GraphQLAdmin,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'admin id'
          }
        },
        resolve: (obj, {id}) => {
          const {id: localId} = fromGlobalId(id);
          return Admin.findById(localId);
        }
      },
      users: {
        type: GraphQLUserConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search user'
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(User, search?{where:{$or:[
              {name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact: {$like: `%${search}%`}}
            ]}}:{}, args)
      },
      workers: {
        type: GraphQLWorkerConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search worker'
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(Worker, search?{where:{$or:[
              {name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact: {$like: `%${search}%`}}
            ]}}:{}, args)
      },
      admins: {
        type: GraphQLAdminConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search admin'
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(Admin, search?{where:{$or:[
              {name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact: {$like: `%${search}%`}}
            ]}}:{}, args)
      },
      orders: {
        type: GraphQLOrderConnection,
        args: {
          userId: {
            type: GraphQLString,
            description: 'user id'
          },
          search: {
            type: GraphQLString,
            description: 'search by order id'
          },
          status: {
            type: new GraphQLList(GraphQLString),
            description: 'order status'
          },
          afterDate: {
            type: GraphQLString,
            description: 'start date'
          },
          beforeDate: {
            type: GraphQLString,
            description: 'end date'
          },
          ...connectionArgs
        },
        resolve: (obj, {userId, search, status, afterDate, beforeDate, ...args}) => {
          let query = {where:{status:{$notIn:['order complete', 'deleted', 'canceled']}}};
          if (userId) query.where.userId = userId;
          if (search) query.where.serialNumber = {$like: `%${search}%`};
          if (status && status.length > 0) query.where.status = {$in: status};
          if (afterDate||beforeDate) query.where.pickupDate = calculateTimeRnage(afterDate, beforeDate);

          return modelConnection(Order, query, args);
        }
      },
      histories: {
        type: GraphQLOrderConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search by order id'
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) => {
          let query = {where:{status: {$in: ['order complete', 'deleted', 'canceled']}}};
          if (search) {
            query.where.serialNumber = {$like: `%${search}%`};
          }

          return modelConnection(Order, query, args);
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
        resolve: (obj, {search, ...args}) => {
          return modelConnection(Transaction, search?{where: {
            referenceNo: {$like: `%${search}%`}
          }}:{}, args);
        }
      },
      cloth: {
        type: GraphQLCloth,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'laundry cloth id'
          }
        },
        resolve: (obj, {id}) => {
          const {id: localId} = fromGlobalId(id);
          return Cloth.findById(localId);
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
              {nameCn: {$like: `%${search}%`}},
              {nameEn: {$like: `%${search}%`}}
            ];
          }
          if (categoryId) {
            query.where.categoryId = categoryId;
          }

          return modelConnection(Cloth, query, args);
        }
      },
      categories: {
        type: GraphQLClothCategoryConnection,
        args: {
          search: {
            type: GraphQLString,
            description: 'search order by order id'
          },
          ...connectionArgs
        },
        resolve: (obj, {search, ...args}) =>
          modelConnection(ClothCategory, search?{
            where: {$or: [
              {nameCn: {$like: `%${search}%`}},
              {nameEn: {$like: `%${search}%`}},
            ]}
          }:{}, args)
      },
      timeSlotTemplates: {
        type: GraphQLTimeSlotTemplateConnection,
        args: {
          ...connectionArgs
        },
        resolve: (obj, args) =>
          modelConnection(TimeSlotTemplate, {order: 'start'}, args)
      },
      timeSlots: {
        type: GraphQLTimeSlotConnection,
        args: {
          date: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'date'
          },
          ...connectionArgs
        },
        resolve: (obj, {date, ...args}) => {
          date = formatToDay(date);
          return TimeSlot.findAll({where:{date}})
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
