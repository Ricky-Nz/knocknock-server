import { GraphQLObjectType } from 'graphql';
import createCloth from './ClothCreate';
import updateCloth from './ClothUpdate';
import deleteCloth from './ClothDelete';
import createCategory from './CategoryCreate';
import updateCategory from './CategoryUpdate';
import deleteCategory from './CategoryDelete';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  	createCloth: createCloth,
  	updateCloth: updateCloth,
  	deleteCloth: deleteCloth,
  	createCategory: createCategory,
  	updateCategory: updateCategory,
  	deleteCategory: deleteCategory
  }
});