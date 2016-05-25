import {
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLBoolean
} from 'graphql';

import {
	connectionArgs,
	connectionFromPromisedArraySlice,
  connectionFromPromisedArray,
  cursorToOffset,
  globalIdField,
  toGlobalId,
  fromGlobalId,
  nodeDefinitions,
  connectionDefinitions
} from 'graphql-relay';

import {
	searchPaginationInput,
	GraphQLPagination,
	clothFields,
	getUserFields,
  clothCategoryFields,
	userPaginationInputs,
	resolveUserPagination,
  clothPaginationInputs,
  modelConnection,
  getAddressInputs,
  getVoucherFields,
  getOrderFields,
  transactionFields,
  timeSlotFields
} from '../models';

import {
  DBUser,
  DBAddress,
  DBCloth,
  DBClothCategory,
  DBVoucher,
  DBOrder,
  DBTransaction,
  DBTimeSlot
} from '../../database';

class FeakViewerClass {}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'User') {
      return DBUser.findById(id);
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
    } else if (type === 'Transaction') {
      return DBTransaction.findById(id);
    } else if (type === 'TimeSlot') {
      return DBTimeSlot.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
  	if (obj instanceof FeakViewerClass) {
    	return GraphQLViewer;
    } else if (obj instanceof DBUser) {
  		return GraphQLUser;
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
    } else if (obj instanceof DBTransaction) {
      return GraphQLTransaction;
    } else if (obj instanceof DBTimeSlot) {
      return GraphQLTimeSlot;
    } else {
  		return null;
  	}
  }
);

export const GraphQLTimeSlot = new GraphQLObjectType({
  name: 'TimeSlot',
  description: 'time slots',
  fields: {
    id: globalIdField('TimeSlot'),
    ...timeSlotFields
  },
  interfaces: [nodeInterface]
});

export const GraphQLTransaction = new GraphQLObjectType({
  name: 'Transaction',
  description: 'transaction record',
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
  description: 'cloth category',
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
	description: 'launtry cloth',
	fields: {
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
    ...getVoucherFields(),
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLVoucherConnection,
  edgeType: GraphQLVoucherEdge
} = connectionDefinitions({
  nodeType: GraphQLVoucher
});

export const GraphQLOrder = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id: globalIdField('Order'),
    ...getOrderFields()
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
  description: 'user address',
  fields: {
    id: globalIdField('Address'),
    ...getAddressInputs()
  },
  interfaces: [nodeInterface]
});

export const {
  connectionType: GraphQLAddressConnection,
  edgeType: GraphQLAddressEdge
} = connectionDefinitions({
  nodeType: GraphQLAddress
});

export const GraphQLUser = new GraphQLObjectType({
	name: 'User',
	description: 'Knocknock User',
	fields: {
    id: globalIdField('User'),
		...getUserFields(),
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

export const GraphQLUserPagination = new GraphQLObjectType({
	name: 'UserPagination',
	fields: {
		id: globalIdField('UserPagination', () => 'rootuserpagination'),
		pagination: {
			type: new GraphQLNonNull(GraphQLPagination),
			description: 'pagination info'
		},
		datas: {
			type: new GraphQLList(GraphQLUser),
			description: 'page datas'
		}
	}
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
    users: {
      type: GraphQLUserConnection,
      args: {
        role: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'user role'
        },
        search: {
          type: GraphQLString,
          description: 'search user'
        },
        ...connectionArgs
      },
      resolve: (obj, {role, search, ...args}) =>
        modelConnection(DBUser, search?{where:{role, $or:[
            {id: {$like: `%${search}%`}},
            {name: {$like: `%${search}%`}},
            {email: {$like: `%${search}%`}},
            {contact: {$like: `%${search}%`}}
          ]}}:{where:{role}}, args)
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
        connectionFromPromisedArray(DBCloth.findAll(), args)
    },
    categories: {
      type: GraphQLClothCategoryConnection,
      args: {
        ...connectionArgs
      },
      resolve: (obj, args) =>
        connectionFromPromisedArray(DBClothCategory.findAll(), args)
    },
    pickupSlots: {
      type: new GraphQLList(GraphQLTimeSlot),
      description: 'pickup time slots',
      resolve: (obj) => DBTimeSlot.findAll({order: 'start DESC'})
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

