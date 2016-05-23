import { GraphQLObjectType } from 'graphql';
import createCloth from './ClothCreate';
import updateCloth from './ClothUpdate';
import deleteCloth from './ClothDelete';
import createCategory from './CategoryCreate';
import updateCategory from './CategoryUpdate';
import deleteCategory from './CategoryDelete';
import createUser from './UserCreate';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  	createCloth,
  	updateCloth,
  	deleteCloth,
  	createCategory,
  	updateCategory,
  	deleteCategory,
  	createUser
  }
});