import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLInterfaceType
} from 'graphql';

import {
	connectionArgs,
	connectionFromPromisedArraySlice,
  cursorToOffset,
  globalIdField,
  fromGlobalId,
  nodeDefinitions,
  connectionDefinitions
} from 'graphql-relay';

import {
	DBUser,
	DBLaundryCloth
} from '../../database';

import jwt from 'jsonwebtoken';

function verifyToken (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'knocknockserver-secret-token', function(err, userId) {
      if (err) {
        reject('invalid token!');
      } else {
        resolve(userId);
      }
    });
  });
}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'User') {
      return DBUser.findById(id);
    } else if (type === 'Cloth') {
      return DBLaundryCloth.findById(id);
    } else if (type === 'Viewer') {
      return new FeakViewerClass();
    } else {
      return null;
    }
  },
  (obj) => {
  	if (obj instanceof FeakViewerClass) {
    	return GraphQLViewer;
    } else if (obj instanceof DBUser) {
  		return GraphQLUser;
  	} else if (obj instanceof DBLaundryCloth) {
      return GraphQLCloth;
    } else {
  		return null;
  	}
  }
);

const GraphQLPagination = new GraphQLObjectType({
	name: 'Pagination',
	fields: {
		search: {
			type: GraphQLString,
			description: 'search'
		},
		totalPage: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'total page count'
		},
		page: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'page index'
		},
		limit: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'each page size'
		}
	}
});

export const GraphQLCloth = new GraphQLObjectType({
	name: 'Cloth',
	description: 'launtry cloth',
	fields: {
		id: globalIdField('Cloth'),
		nameEn: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'english name'
		},
		nameCn: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'chinese name'
		},
		washPrice: {
			type: new GraphQLNonNull(GraphQLFloat),
			description: 'normal wash price'
		},
		dryCleanPrice: {
			type: new GraphQLNonNull(GraphQLFloat),
			description: 'dry clean price'
		},
		ironPrice: {
			type: new GraphQLNonNull(GraphQLFloat),
			description: 'iron clean price'
		},
		washPriceDiscount: {
			type: GraphQLFloat,
			description: 'normal wash price discount'
		},
		dryCleanPriceDiscount: {
			type: GraphQLFloat,
			description: 'dry clean price discount'
		},
		ironPriceDiscount: {
			type: GraphQLFloat,
			description: 'iron clean price discount'
		},
		special: {
			type: GraphQLBoolean,
			description: 'special item'
		},
		imageUrl: {
			type: GraphQLString,
			description: 'cloth image url'
		}
	},
	interfaces: [nodeInterface]
});

export const {
	connectionType: GraphQLClothConnection,
	edgeType: GraphQLClothEdge
} = connectionDefinitions({
	nodeType: GraphQLCloth
});

export const GraphQLClothPagination = new GraphQLObjectType({
	name: 'ClothPagination',
	fields: {
		id: globalIdField('ClothPagination', () => 'rootclothpagination'),
		pagination: {
			type: new GraphQLNonNull(GraphQLPagination),
			description: 'pagination info'
		},
		datas: {
			type: new GraphQLList(GraphQLCloth),
			description: 'page datas'
		}
	}
});

const GraphQLUserRole = new GraphQLEnumType({
	name: 'Role',
	description: 'User role',
	values: {
		Client: { value: 'client' },
		Worker: { value: 'worker' },
		Admin: { value: 'admin' }
	}
});

export const GraphQLUser = new GraphQLObjectType({
	name: 'User',
	description: 'Knocknock User',
	fields: {
		id: globalIdField('User'),
		role: {
			type: new GraphQLNonNull(GraphQLUserRole),
			description: 'user role'
		},
		email: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'user login email'
		},
		name: {
			type: GraphQLString,
			description: 'user name'
		},
		contact: {
			type: GraphQLString,
			description: 'contact phone number'
		},
		avatarUrl: {
			type: GraphQLString,
			description: 'avatar image url'
		},
		emailVerified: {
			type: GraphQLBoolean,
			description: 'login email verified'
		},
		contactVerified: {
			type: GraphQLBoolean,
			description: 'contact phoen verified'
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

const searchPaginationArgs = {
	search: {
		type: GraphQLString,
		description: 'search'
	},
	page: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'page index'
	},
	limit: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'each page size'
	}
};

export function modelConnection (dbClass, query, args) {
  return dbClass.count(query)
    .then((count) => {
      query.skip = 0;

      if (args.first) {
        query.limit = args.first;
      } else if (args.last) {
        query.limit = args.last;
        query.skip = Math.max(0, count - args.last);
      } 

      if (args.after) {
        query.skip = cursorToOffset(args.after) + 1;
      } else if (args.before) {
        const offset = cursorToOffset(args.before);
        query.skip = Math.max(0, offset - args.last);
      }

      return connectionFromPromisedArraySlice(dbClass.findAll(query), args, {
        sliceStart: query.skip,
        arrayLength: count
      });
    });
}

export function resolvePagination (dbClass, selection, page, limit) {
	let query = {
		order: 'updatedAt DESC'
	};

	if (selection) query.where = selection;

	let totalPage;
	return dbClass
		.count(query)
		.then(count => {
			totalPage = Math.ceil(count / limit);
			return dbClass.findAll({...query, offset: (page - 1) * limit, limit})
		})
		.then(datas => ({
			pagination: {
				totalPage,
				page,
				limit
			},
			datas
		}));
}

export const GraphQLViewer =  new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    id: globalIdField('Viewer', () => 'VIEWER'),
    user: {
      type: GraphQLUser,
      description: 'login user info',
      args: {
        token: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'authorize token'
        }
      },
      resolve: (obj, {token}) =>
        verifyToken(token)
          .then(id => DBUser.findById(id))
          .then(user => user)
    },
    userPage: {
    	type: GraphQLUserPagination,
    	description: 'user pagination',
    	args: {
        role: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'user role'
        },
    		...searchPaginationArgs
    	},
    	resolve: (obj, {role, search, page, limit}) =>
    		resolvePagination(DBUser, search?{
    			$or: [
					  {name: {$like: `%${search}%`}},
					  {email: {$like: `%${search}%`}},
					  {contact: {$like: `%${search}%`}}
					],
					$and: {
						role
					}
				}:null, page, limit)
    },
    userScroll: {
      type: GraphQLUserConnection,
      args: {
        role: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'user role'
        },
        search: {
          type: GraphQLString,
          description: 'search for email, contact or name'
        },
        ...connectionArgs
      },
      resolve: (obj, {role, search, ...args}) =>
        modelConnection(DBUser, {
          where: search?
            {$or: [
              {name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact: {$like: `%${search}%`}}
            ]} : {role}
        }, args)
    },
    cloth: {
      type: GraphQLCloth,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'laundry cloth id'
        }
      },
      reslove: (obj, {id}) =>
        DBLaundryCloth.findById(id)
    },
    clothPage: {
    	type: GraphQLClothPagination,
    	description: 'cloth pagination',
    	args: {
    		...searchPaginationArgs
    	},
    	resolve: (obj, {search, page, limit}) =>
    		resolvePagination(DBLaundryCloth, search?{
    			$or: [
	          {nameCn: {$like: `%${search}%`}},
	          {nameEn: {$like: `%${search}%`}}
	        ]
      	}:null, page, limit)
    },
    clothScroll: {
      type: GraphQLClothConnection,
      args: {
        search: {
          type: GraphQLString,
          description: 'search for chinese name or english name'
        },
        ...connectionArgs
      },
      resolve: (obj, {search, ...args}) =>
        modelConnection(DBLaundryCloth, search? {
          where: {$or: [
            {nameCn: {$like: `%${search}%`}},
            {nameEn: {$like: `%${search}%`}}
          ]}
        } : {}, args)
    }
  },
  interfaces: [nodeInterface]
});

class FeakViewerClass {
}

export const query = new GraphQLObjectType({
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

