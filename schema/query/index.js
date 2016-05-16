import { GraphQLObjectType } from 'graphql';
import GraphQLViewer from './GraphQLViewer';
import { nodeField } from './nodeDefinition';

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