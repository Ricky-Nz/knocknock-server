import { GraphQLObjectType } from 'graphql';
import ProfileMutation from './ProfileMutation';
import AddressMutation from './AddressMutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  	...ProfileMutation,
  	...AddressMutation
  }
});