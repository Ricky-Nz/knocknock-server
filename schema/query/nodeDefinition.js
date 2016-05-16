import { nodeDefinitions } from 'graphql-relay';
import { DBUser, DBLaundryCloth } from '../../database';
import GraphQLUser from './GraphQLUser';

const { nodeInterface: inter, nodeField: field } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'User') {
      return DBUser.findById(id);
    } else if (type === 'LaundryCloth') {
      return DBLaundryCloth.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
  	if (obj instanceof DBUser) {
  		return GraphQLUser;
  	} else if (obj instanceof DBLaundryCloth) {
      return GraphQLLaundryCloth;
    } else {
  		return null;
  	}
  }
);

export const nodeInterface = inter;

export const nodeField = field;