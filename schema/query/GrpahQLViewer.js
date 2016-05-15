import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { connectionArgs, connectionFromPromisedArray } from 'graphql-relay';
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

const GraphQLViewer = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
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
      resolve: (obj, {role, search, ...args}) =>
        connectionFromPromisedArray(DBUser.findAll(
          {where: search? {$or: [{name: {$like: `%${search}%`}}, {email: {$like: `%${search}%`}}, {contact: {$like: `%${search}%`}}]} : {role}}), args)
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
      resolve: (obj, {search, ...args}) =>
        connectionFromPromisedArray(DBLaundryCloth.findAll(
          {where: search? {$or: [{nameEn: {$like: `%${search}%`}}, {nameCn: {$like: `%${search}%`}}]} : {}}), args)
    }
  }
});
