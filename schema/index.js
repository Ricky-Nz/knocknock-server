import { GraphQLSchema } from 'graphql';
import { appRootQuery, backendRootQuery } from './query';
import appMutation from './appmutation';
import backendMutation from './backendmutation';

// Define the schema with one top-level field, `user`, that
// takes an `id` argument and returns the User with that ID.
// Note that the `query` is a GraphQLObjectType, just like User.
// The `user` field, however, is a userType, which we defined above.
export const AppSchema = new GraphQLSchema({ query: appRootQuery });

export const BackendSchema = new GraphQLSchema({ query: backendRootQuery, mutation: backendMutation });