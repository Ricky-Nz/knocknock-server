import { GraphQLObjectType } from 'graphql';
import ProfileMutation from './ProfileMutation';
import AddressMutation from './AddressMutation';
import OrderMutation from './OrderMutation';
import CreditMutation from './CreditMutation';
import CreditCardMutation from './CreditCardMutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  	...ProfileMutation,
  	...AddressMutation,
  	...OrderMutation,
  	...CreditMutation,
  	...CreditCardMutation
  }
});