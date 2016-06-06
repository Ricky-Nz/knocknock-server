import {
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLBoolean
} from 'graphql';

import {
	connectionArgs,
  cursorToOffset,
  globalIdField,
  toGlobalId,
  fromGlobalId,
  nodeDefinitions,
  connectionDefinitions,
  connectionFromArray
} from 'graphql-relay';

import {
  User,
  Admin,
  Worker,
  Address,
  Cloth,
  Viewer,
  ClothCategory,
  Voucher,
  Order,
  OrderItem,
  Transaction,
  TimeSlotTemplate,
  TimeSlot,
  Factory,
  Wallet,
  PromoCode,
  Banner,
  Feedback
} from '../models';

import { modelConnection, formatToDay, calculateTimeRnage } from '../service';

class FeakViewerClass {}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'Viewer') {
      return new FeakViewerClass();
    } else if (type === 'User') {
      return User.findById(id);
    } else if (type === 'Admin') {
      return Admin.findById(id);
    } else if (type === 'Worker') {
      return Worker.findById(id);
    } else if (type === 'Address') {
      return Address.findById(id);
    } else if (type === 'Cloth') {
      return Cloth.findById(id);
    } else if (type === 'ClothCategory') {
      return ClothCategory.findById(id);
    } else if (type === 'Voucher') {
      return Voucher.findById(id);
    } else if (type === 'Order') {
      return Order.findById(id);
    } else if (type === 'OrderItem') {
      return OrderItem.findById(id);
    } else if (type === 'Transaction') {
      return Transaction.findById(id);
    } else if (type === 'TimeSlotTemplate') {
      return TimeSlotTemplate.findById(id);
    } else if (type === 'TimeSlot') {
      return TimeSlot.findById(id);
    } else if (type === 'Factory') {
      return Factory.findById(id);
    } else if (type === 'Wallet') {
      return Wallet.findById(id);
    } else if (type === 'PromoCode') {
      return PromoCode.findById(id);
    } else if (type === 'Banner') {
      return Banner.findById(id);
    } else if (type === 'Feedback') {
      return Feedback.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
  	if (obj instanceof FeakViewerClass) {
    	return GraphQLViewer;
    } else if (User.is(obj)) {
  		return GraphQLUser;
  	} else if (Admin.is(obj)) {
      return GraphQLAdmin;
    } else if (Worker.is(obj)) {
      return GraphQLWorker;
    } else if (Address.is(obj)) {
      return GraphQLAddress;
    } else if (Cloth.is(obj)) {
      return GraphQLCloth;
    } else if (ClothCategory.is(obj)) {
      return GraphQLClothCategory;
    } else if (Voucher.is(obj)) {
      return GraphQLVoucher;
    } else if (Order.is(obj)) {
      return GraphQLOrder;
    } else if (OrderItem.is(obj)) {
      return GraphQLOrderItem;
    } else if (Transaction.is(obj)) {
      return GraphQLTransaction;
    } else if (TimeSlotTemplate.is(obj)) {
      return GraphQLTimeSlotTemplate;
    } else if (TimeSlot.is(obj)) {
      return GraphQLTimeSlot;
    } else if (Factory.is(obj)) {
      return GraphQLFactory;
    } else if (Wallet.is(obj)) {
      return GraphQLWallet;
    } else if (PromoCode.is(obj)) {
      return GraphQLPromoCode;
    } else if (Banner.is(obj)) {
      return GraphQLBanner;
    } else if (Feedback.is(obj)) {
      return GraphQLFeedback;
    } else {
  		return null;
  	}
  }
);

export const GraphQLBanner = new GraphQLObjectType({
  name: 'Banner',
  fields: {
    id: globalIdField('Banner'),
    ...Banner.fields
  },
  interfaces: [nodeInterface]
})

export const {
  connectionType: GraphQLBannerConnection,
  edgeType: GraphQLBannerEdge
} = connectionDefinitions({
  nodeType: GraphQLBanner
});

export const GraphQLPromoCode = new GraphQLObjectType({
  name: 'PromoCode',
  fields: {
    id: globalIdField('PromoCode'),
    ...PromoCode.fields
  },
  interfaces: [nodeInterface]
})

export const {
  connectionType: GraphQLPromoCodeConnection,
  edgeType: GraphQLPromoCodeEdge
} = connectionDefinitions({
  nodeType: GraphQLPromoCode
});

export const GraphQLFactory = new GraphQLObjectType({
  name: 'Factory',
  fields: {
    id: globalIdField('Factory'),
    ...Factory.fields
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLFactoryConnection,
  edgeType: GraphQLFactoryEdge
} = connectionDefinitions({
  nodeType: GraphQLFactory
});

export const GraphQLTimeSlotTemplate = new GraphQLObjectType({
  name: 'TimeSlotTemplate',
  fields: {
    id: globalIdField('TimeSlotTemplate'),
    ...TimeSlotTemplate.fields
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLTimeSlotTemplateConnection,
  edgeType: GraphQLTimeSlotTemplateEdge
} = connectionDefinitions({
  nodeType: GraphQLTimeSlotTemplate
});

export const GraphQLTimeSlot = new GraphQLObjectType({
  name: 'TimeSlot',
  fields: {
    id: globalIdField('TimeSlot'),
    ...TimeSlot.fields
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLTimeSlotConnection,
  edgeType: GraphQLTimeSlotEdge
} = connectionDefinitions({
  nodeType: GraphQLTimeSlot
});

export const GraphQLUserReference = new GraphQLObjectType({
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

export const GraphQLTransaction = new GraphQLObjectType({
  name: 'Transaction',
  fields: {
    id: globalIdField('Transaction'),
    ...Transaction.fields,
    user: {
      type: GraphQLUserReference,
      resolve: (transaction) => {
        const {id: walletId} = fromGlobalId(transaction.walletId);
        return Transaction.findById(walletId)
          .then(wallet => {
            const {id: userId} = fromGlobalId(wallet.userId);
            return User.findById(userId);
          })
          .then(user => ({
            id: toGlobalId('User', user.id),
            name: user.name,
            email: user.email
          }));
      }
    }
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLTransactionConnection,
  edgeType: GraphQLTransactionEdge
} = connectionDefinitions({
  nodeType: GraphQLTransaction
});

export const GraphQLClothCategory = new GraphQLObjectType({
  name: 'ClothCategory',
  fields: {
    id: globalIdField('ClothCategory'),
    ...ClothCategory.fields
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLClothCategoryConnection,
  edgeType: GraphQLClothCategoryEdge
} = connectionDefinitions({
  nodeType: GraphQLClothCategory
});

export const GraphQLCloth = new GraphQLObjectType({
	name: 'Cloth',
	fields: {
    id: globalIdField('Cloth'),
		...Cloth.fields
	},
	interfaces: [nodeInterface]
});

export const {
	connectionType: GraphQLClothConnection,
	edgeType: GraphQLClothEdge
} = connectionDefinitions({
	nodeType: GraphQLCloth
});

export const GraphQLVoucher = new GraphQLObjectType({
  name: 'Voucher',
  fields: {
    id: globalIdField('Voucher'),
    ...Voucher.fields,
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLVoucherConnection,
  edgeType: GraphQLVoucherEdge
} = connectionDefinitions({
  nodeType: GraphQLVoucher
});

export const GraphQLOrderItemInput = new GraphQLInputObjectType({
  name: 'OrderItemInput',
  fields: {
    ...OrderItem.inputs
  }
});

export const GraphQLOrderItem = new GraphQLObjectType({
  name: 'OrderItem',
  fields: {
    id: globalIdField('OrderItem'),
    ...OrderItem.fields
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLOrderItemConnection,
  edgeType: GraphQLOrderItemEdge
} = connectionDefinitions({
  nodeType: GraphQLOrderItem
});

export const GraphQLOrder = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id: globalIdField('Order'),
    ...Order.fields,
    userAvatar: {
      type: GraphQLString,
      resolve: (order) => {
        const {id} = fromGlobalId(order.userId);
        return User.findById(id).then(user => user.avatarUrl);
      }
    },
    orderItems: {
      type: GraphQLOrderItemConnection,
      args: {
        ...connectionArgs
      },
      resolve: (order, args) =>
        modelConnection(OrderItem, {where:{serialNumber: order.serialNumber}}, args)
    }
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLOrderConnection,
  edgeType: GraphQLOrderEdge
} = connectionDefinitions({
  nodeType: GraphQLOrder
});

export const GraphQLAddress = new GraphQLObjectType({
  name: 'Address',
  fields: {
    id: globalIdField('Address'),
    ...Address.fields
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLAddressConnection,
  edgeType: GraphQLAddressEdge
} = connectionDefinitions({
  nodeType: GraphQLAddress
});

export const GraphQLWallet = new GraphQLObjectType({
  name: 'Wallet',
  fields: {
    id: globalIdField('Wallet'),
    ...Wallet.fields
  },
  interfaces: [nodeInterface]
});

export const GraphQLUser = new GraphQLObjectType({
	name: 'User',
	fields: {
    id: globalIdField('User'),
		...User.fields,
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

export const {
	connectionType: GraphQLUserConnection,
	edgeType: GraphQLUserEdge
} = connectionDefinitions({
	nodeType: GraphQLUser
});

export const GraphQLFeedback = new GraphQLObjectType({
  name: 'Feedback',
  fields: {
    id: globalIdField('Feedback'),
    ...Feedback.fields,
    user: {
      type: GraphQLUser,
      resolve: (feedback) => {
        const {id} = fromGlobalId(feedback.userId);
        return User.findById(id);
      }
    }
  },
  interfaces: [nodeInterface]
})

export const {
  connectionType: GraphQLFeedbackConnection,
  edgeType: GraphQLFeedbackEdge
} = connectionDefinitions({
  nodeType: GraphQLFeedback
});

export const GraphQLWorker = new GraphQLObjectType({
  name: 'Worker',
  fields: {
    id: globalIdField('Worker'),
    ...Worker.fields
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLWorkerConnection,
  edgeType: GraphQLWorkerEdge
} = connectionDefinitions({
  nodeType: GraphQLWorker
});

export const GraphQLAdmin = new GraphQLObjectType({
  name: 'Admin',
  fields: {
    id: globalIdField('Admin'),
    ...Admin.fields
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLAdminConnection,
  edgeType: GraphQLAdminEdge
} = connectionDefinitions({
  nodeType: GraphQLAdmin
});

export const GraphQLViewer = new GraphQLObjectType({
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


export default new GraphQLObjectType({
  name: 'Query',
  description: 'Query root',
  fields: {
    viewer: {
      type: GraphQLViewer,
      resolve: () => new FeakViewerClass()
    },
    node: nodeField
  }
});

