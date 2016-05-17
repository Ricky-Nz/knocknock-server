import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { connectionArgs, connectionFromPromisedArraySlice, cursorToOffset } from 'graphql-relay';
import { GraphQLUser, GraphQLUserConnection } from './GraphQLUser';
import { GraphQLLaundryCloth, GraphQLLaundryClothConnection } from './GraphQLLaundryCloth';
import { DBUser, DBLaundryCloth } from '../../database';
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

function modelConnection(dbClass, query, args) {
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

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: () => 'VIEWER'
    },
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
    users: {
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
      resolve: (obj, {role, search, ...args}) => {
        let query = {
          where: search?
            {$or: [
              {name: {$like: `%${search}%`}},
              {email: {$like: `%${search}%`}},
              {contact: {$like: `%${search}%`}}
            ]} : {role}
        };

        return modelConnection(DBUser, query, args);
      }
    },
    laundryCloth: {
      type: GraphQLLaundryCloth,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'laundry cloth id'
        }
      },
      reslove: (obj, {id}) =>
        DBLaundryCloth.findById(id)
    },
    laundryClothes: {
      type: GraphQLLaundryClothConnection,
      args: {
        search: {
          type: GraphQLString,
          description: 'search for chinese name or english name'
        },
        ...connectionArgs
      },
      resolve: (obj, {search, ...args}) => {
        let query = search? {
          where: {$or: [
            {nameCn: {$like: `%${search}%`}},
            {nameEn: {$like: `%${search}%`}}
          ]}
        } : {};

        return modelConnection(DBLaundryCloth, query, args);
      }
    }
  }
});
