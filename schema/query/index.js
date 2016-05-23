import {
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';

import {
	connectionArgs,
	connectionFromPromisedArraySlice,
  connectionFromPromisedArray,
  cursorToOffset,
  globalIdField,
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
  modelConnection
} from '../models';

import {
  DBUser,
  DBCloth,
  DBClothCategory
} from '../../database';

class FeakViewerClass {}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'User') {
      return DBUser.findById(id);
    } else if (type === 'Cloth') {
      return DBCloth.findById(id);
    } else if (type === 'Viewer') {
      return new FeakViewerClass();
    } else if (type === 'ClothCategory') {
      return DBClothCategory.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
  	if (obj instanceof FeakViewerClass) {
    	return GraphQLViewer;
    } else if (obj instanceof DBUser) {
  		return GraphQLUser;
  	} else if (obj instanceof DBCloth) {
      return GraphQLCloth;
    } else if (obj instanceof DBClothCategory) {
      return GraphQLClothCategory;
    } else {
  		return null;
  	}
  }
);

export const GraphQLClothCategory = new GraphQLObjectType({
  name: 'ClothCategory',
  description: 'cloth category',
  fields: {
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

export const GraphQLUser = new GraphQLObjectType({
	name: 'User',
	description: 'Knocknock User',
	fields: {
		...getUserFields()
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
        ...connectionArgs
      },
      resolve: (obj, {role, ...args}) =>
        modelConnection(DBUser, {where:{role}}, args)
    },
    userPage: {
    	type: GraphQLUserPagination,
    	args: userPaginationInputs,
    	resolve: resolveUserPagination
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

