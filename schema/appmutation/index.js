import { GraphQLObjectType } from 'graphql';
import ProfileMutation from './ProfileMutation';
import AddressMutation from './AddressMutation';
import OrderMutation from './OrderMutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  	...ProfileMutation,
  	...AddressMutation,
  	...OrderMutation
  }
});