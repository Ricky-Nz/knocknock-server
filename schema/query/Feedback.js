import { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { DBUsers } from '../../service/database';

// id      
// user_id     
// rating      
// comment     
// created

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

          return DBUsers.findById(obj.user_id);
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
