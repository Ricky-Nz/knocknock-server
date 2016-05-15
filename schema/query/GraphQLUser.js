import { GraphQLObjectType, GraphQLEnumType,
	GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { connectionDefinitions, globalIdField, fromGlobalId } from 'graphql-relay';
import { nodeInterface } from './nodeDefinition';

const GraphQLUserRole = new GraphQLEnumType({
	name: 'Role',
	description: 'User role',
	values: {
		Client: { value: 'Client' },
		Worker: { value: 'Worker' },
		Admin: { value: 'Admin' }
	}
});

export const GraphQLUser = new GraphQLObjectType({
	name: 'User',
	description: 'Knocknock User',
	fields: {
		id: globalIdField('User'),
		role: {
			type: new GraphQLNonNull(GraphQLUserRole),
			description: 'user role'
		},
		email: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'user login email'
		},
		name: {
			type: GraphQLString,
			description: 'user name'
		},
		contact: {
			type: GraphQLString,
			description: 'contact phone number'
		},
		avatarUrl: {
			type: GraphQLString,
			description: 'avatar image url'
		},
		emailVerified: {
			type: GraphQLBoolean,
			description: 'login email verified'
		},
		contactVerified: {
			type: GraphQLBoolean,
			description: 'contact phoen verified'
		}
	},
	interfaces: [nodeInterface]
});

const { connectionType, edgeType } = connectionDefinitions({
	nodeType: GraphQLUser
});

export const GraphQLUserEdge = edgeType;

export const GraphQLUserConnection = connectionType;