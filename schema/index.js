import { GraphQLSchema } from 'graphql';
import { query } from './query';
import mutation from './mutation';

// Define the schema with one top-level field, `user`, that
// takes an `id` argument and returns the User with that ID.
// Note that the `query` is a GraphQLObjectType, just like User.
// The `user` field, however, is a userType, which we defined above.
export default new GraphQLSchema({ query, mutation });