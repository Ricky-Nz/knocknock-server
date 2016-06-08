import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLViewer, GraphQLFactory, GraphQLFactoryEdge } from '../query';
import { Factories } from '../../service/database';

// id			
// name			
// address			
// postal_code			
// contact_no			
// contact_name			
// profile_image_url_small			
// profile_image_url_medium			
// profile_image_url_big			
// created_on

const createFactory = mutationWithClientMutationId({
	name: 'CreateFactory',
	inputFields: {
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		address: {
			type: new GraphQLNonNull(GraphQLString)
		},
		postalCode: {
			type: new GraphQLNonNull(GraphQLString)
		},
		contact: {
			type: new GraphQLNonNull(GraphQLString)
		},
		contactName: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		factoryEdge: {
			type: GraphQLFactoryEdge,
			resolve: (factory) => ({
				cursor: offsetToCursor(0),
				node: factory
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: ({name, address, postalCode, contact, contactName}) =>
		Factories.create({
			name,
			address,
			postal_code: postalCode,
			contact_no: contact,
			contact_name: contactName
		})
});

const updateFactory = mutationWithClientMutationId({
	name: 'UpdateFactory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		},
		name: {
			type: GraphQLString
		},
		address: {
			type: GraphQLString
		},
		postalCode: {
			type: GraphQLString
		},
		contact: {
			type: GraphQLString
		},
		contactName: {
			type: GraphQLString
		}
	},
	outputFields: {
		factory: {
			type: GraphQLFactory,
			resolve: ({localId}) => Factories.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, name, address, postalCode, contact, contactName}) => {
		const {id: localId} = fromGlobalId(id);
		return Factories.update({
			name,
			address,
			postal_code: postalCode,
			contact_no: contact,
			contact_name: contactName
		}, {where: {id: localId}}).then(() => ({localId}));
	}
});


const deleteFactory = mutationWithClientMutationId({
	name: 'DeleteFactory',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		deletedId: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({id}) => id
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return Factories.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});

export default {
	createFactory,
	updateFactory,
	deleteFactory
};


