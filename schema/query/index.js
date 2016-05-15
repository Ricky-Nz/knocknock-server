import { GraphQLObjectType } from 'graphql';
import { nodeField } from './nodeDefinition';
import GraphQLViewer from './GraphQLViewer';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'Query root',
  fields: {
    node: nodeField,
    viewer: {
      type: GraphQLViewer,
      resolve: () => ({})
    }
  }
});