import { GraphQLObjectType } from 'graphql';
import UserMutation from './UserMutation';
import AddressMutation from './AddressMutation';
import OrderMutation from './OrderMutation';
import CreditMutation from './CreditMutation';
import CreditCardMutation from './CreditCardMutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  	...UserMutation,
  	...AddressMutation,
  	...OrderMutation,
  	...CreditMutation,
  	...CreditCardMutation
  }
});