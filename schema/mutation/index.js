import { GraphQLObjectType } from 'graphql';
import { CreateCloth, UpdateCloth, DeleteCloth } from './ClothMutation';
import CreateUser from './CreateUser';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  	createUser: CreateUser,
  	createCloth: CreateCloth,
  	updateCloth: UpdateCloth,
  	deleteCloth: DeleteCloth
  }
});