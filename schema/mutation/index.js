import { GraphQLObjectType } from 'graphql';
import CreateUser from './CreateUser';
import CreateLaundryCloth from './CreateLaundryCloth';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  	createUser: CreateUser,
  	createLaundryCloth: CreateLaundryCloth
  }
});