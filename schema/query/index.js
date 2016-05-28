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
  connectionDefinitions
} from 'graphql-relay';

import {
  userFields,
  adminFields,
  workerFields,
	clothFields,
  clothCategoryFields,
  addressFields,
  voucherFields,
  orderFields,
  orderItemFields,
  transactionFields,
  timeSlotFields,
  factoryFields,
  walletFields,
  getOrderInputs
} from '../models';

import {
  DBUser,
  DBAdmin,
  DBWorker,
  DBAddress,
  DBCloth,
  DBClothCategory,
  DBVoucher,
  DBOrder,
  DBOrderItem,
  DBTransaction,
  DBTimeSlot,
  DBFactory,
  DBWallet
} from '../../database';

import { modelConnection } from '../service';

class FeakViewerClass {}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'User') {
      return DBUser.findById(id);
    } else if (type === 'Admin') {
      return DBAdmin.findById(id);
    } else if (type === 'Worker') {
      return DBWorker.findById(id);
    } else if (type === 'Address') {
      return DBAddress.findById(id);
    } else if (type === 'Cloth') {
      return DBCloth.findById(id);
    } else if (type === 'Viewer') {
      return new FeakViewerClass();
    } else if (type === 'ClothCategory') {
      return DBClothCategory.findById(id);
    } else if (type === 'Voucher') {
      return DBVoucher.findById(id);
    } else if (type === 'Order') {
      return DBOrder.findById(id);
    } else if (type === 'OrderItem') {
      return DBOrderItem.findById(id);
    } else if (type === 'Transaction') {
      return DBTransaction.findById(id);
    } else if (type === 'TimeSlot') {
      return DBTimeSlot.findById(id);
    } else if (type === 'Factory') {
      return DBFactory.findById(id);
    } else if (type === 'Wallet') {
      return DBWallet.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
  	if (obj instanceof FeakViewerClass) {
    	return GraphQLViewer;
    } else if (obj instanceof DBUser) {
  		return GraphQLUser;
  	} else if (obj instanceof DBAdmin) {
      return GraphQLAdmin;
    } else if (obj instanceof DBWorker) {
      return GraphQLWorker;
    } else if (obj instanceof DBAddress) {
      return GraphQLAddress;
    } else if (obj instanceof DBCloth) {
      return GraphQLCloth;
    } else if (obj instanceof DBClothCategory) {
      return GraphQLClothCategory;
    } else if (obj instanceof DBVoucher) {
      return GraphQLVoucher;
    } else if (obj instanceof DBOrder) {
      return GraphQLOrder;
    } else if (obj instanceof DBOrderItem) {
      return GraphQLOrderItem;
    } else if (obj instanceof DBTransaction) {
      return GraphQLTransaction;
    } else if (obj instanceof DBTimeSlot) {
      return GraphQLTimeSlot;
    } else if (obj instanceof DBFactory) {
      return GraphQLFactory;
    } else if (obj instanceof DBWallet) {
      return GraphQLWallet;
    } else {
  		return null;
  	}
  }
);

export const GraphQLFactory = new GraphQLObjectType({
  name: 'Factory',
  fields: {
    id: globalIdField('Factory'),
    ...factoryFields
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLFactoryConnection,
  edgeType: GraphQLFactoryEdge
} = connectionDefinitions({
  nodeType: GraphQLFactory
});

export const GraphQLTimeSlot = new GraphQLObjectType({
  name: 'TimeSlot',
  fields: {
    id: globalIdField('TimeSlot'),
    ...timeSlotFields
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLTimeSlotConnection,
  edgeType: GraphQLTimeSlotEdge
} = connectionDefinitions({
  nodeType: GraphQLTimeSlot
});

export const GraphQLTransaction = new GraphQLObjectType({
  name: 'Transaction',
  fields: {
    id: globalIdField('Transaction'),
    ...transactionFields
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
    ...clothCategoryFields
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
		...clothFields
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
    ...voucherFields,
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
    ...getOrderInputs()
  }
});

export const GraphQLOrderItem = new GraphQLObjectType({
  name: 'OrderItem',
  fields: {
    id: globalIdField('OrderItem'),
    ...orderItemFields
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
    ...orderFields,
    orderItems: {
      type: GraphQLOrderItemConnection,
      args: {
        ...connectionArgs
      },
      resolve: (order, args) =>
        modelConnection(DBOrderItem, {where:{orderId: toGlobalId('Order', order.id)}}, args)
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
    ...addressFields
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
    ...walletFields
  },
  interfaces: [nodeInterface]
});

export const GraphQLUser = new GraphQLObjectType({
	name: 'User',
	fields: {
    id: globalIdField('User'),
		...userFields,
    addresses: {
      type: GraphQLAddressConnection,
      args: {
        ...connectionArgs
      },
      resolve: (user, args) =>
        modelConnection(DBAddress, {where:{userId: toGlobalId('User', user.id)}}, args)
    },
    vouchers: {
      type: GraphQLVoucherConnection,
      args: {
        all: {
          type: GraphQLBoolean,
          description: 'show all voucher include used voucher'
        },
        ...connectionArgs
      },
      resolve: (user, {all, ...args}) => {
        const userId = toGlobalId('User', user.id);
        return modelConnection(DBVoucher, {where: all?{userId}:{userId, used: false}}, args);
      }
    },
    order: {
      type: GraphQLOrder,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'order id'
        }
      },
      resolve: (obj, {id}) => DBOrder.findById(id)
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
        return modelConnection(DBOrder, {where: search?{userId, $or: [
            {id: {$like: `%${search}%`}}
          ]}:{userId}}, args);
      }
    },
    transactions: {
      type: GraphQLTransactionConnection,
      args: {
        ...connectionArgs
      },
      resolve: (user, args) => {
        const userId = toGlobalId('User', user.id);
        return modelConnection(DBTransaction, {where: {userId}}, args);
      }
    },
    wallet: {
      type: GraphQLWallet,
      resolve: (user) => DBWallet.findOne({where:{userId:toGlobalId('User', user.id)}})
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

export const GraphQLWorker = new GraphQLObjectType({
  name: 'Worker',
  fields: {
    id: globalIdField('Worker'),
    ...workerFields
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
    ...adminFields
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLAdminConnection,
  edgeType: GraphQLAdminEdge
} = connectionDefinitions({
  nodeType: GraphQLAdmin
});

export const GraphQLViewer =  new GraphQLObjectType({
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
        return DBUser.findById(localId);
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
        return DBWorker.findById(localId);
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
        return DBAdmin.findById(localId);
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
        modelConnection(DBUser, search?{where:{$or:[
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
        modelConnection(DBWorker, search?{where:{$or:[
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
        modelConnection(DBAdmin, search?{where:{$or:[
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
        ...connectionArgs
      },
      resolve: (obj, {userId, search, ...args}) => {
        let query = {where:{}};
        if (userId) {
          query.where.userId = userId;
        }
        if (search) {
          query.where.id = {$like: `%${search}%`}
        }

        return modelConnection(DBOrder, query, args);
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
        return DBCloth.findById(localId);
      }
    },
    clothes: {
    	type: GraphQLClothConnection,
      args: {
        ...connectionArgs
      },
    	resolve: (obj, args) =>
        modelConnection(DBCloth, {}, args)
    },
    categories: {
      type: GraphQLClothCategoryConnection,
      args: {
        ...connectionArgs
      },
      resolve: (obj, args) =>
        modelConnection(DBClothCategory, {}, args)
    },
    timeSlots: {
      type: GraphQLTimeSlotConnection,
      args: {
        ...connectionArgs
      },
      resolve: (obj, args) =>
        modelConnection(DBTimeSlot, {}, args)
    },
    factories: {
      type: GraphQLFactoryConnection,
      args: {
        ...connectionArgs
      },
      resolve: (obj, args) =>
        modelConnection(DBFactory, {}, args)
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

