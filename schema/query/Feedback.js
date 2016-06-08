import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { Users } from '../../service/database';

   // { id: 1,
   //   user_id: 922,
   //   rating: 3,
   //   comment: 'sdfsdf',
   //   created: Wed Mar 16 2016 11:38:47 GMT+0800 (SGT) },

export default function (nodeInterface, {GraphQLUser}) {
  const nodeType = new GraphQLObjectType({
    name: 'Feedback',
    fields: {
      id: globalIdField('Feedback'),
      userId: {
        type: GraphQLString,
        resolve: (obj) => obj.user_id
      },
      rating: {
        type: GraphQLFloat,
        resolve: (obj) => obj.rating
      },
      comment: {
        type: GraphQLString,
        resolve: (obj) => obj.comment
      },
      createdAt: {
        type: GraphQLString,
        resolve: (obj) => obj.created
      },
      user: {
        type: GraphQLUser,
        resolve: (obj) => {
          if (!obj.user_id) return null;

          return Users.findById(obj.user_id);
        }
      }
    },
    interfaces: [nodeInterface]
  });

  return {
    nodeType,
    ...connectionDefinitions({nodeType})
  };
}
