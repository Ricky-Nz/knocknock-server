import { nodeDefinitions } from 'graphql-relay';
import { DBUser } from '../../database';
import GraphQLUser from './GraphQLUser';

const { nodeInterface: inter, nodeField: field } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
  },
  (obj) => {
  	if (obj instanceof DBUser) {
  		return GraphQLUser;
  	} else {
  		return null;
  	}
  }
);

export const nodeInterface = inter;

export const nodeField = field;