import {
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	offsetToCursor,
	fromGlobalId,
} from 'graphql-relay';

import {
	DBViewer,
	DBTimeSlot
} from '../../database';

import {
	GraphQLViewer,
	GraphQLTimeSlotEdge,
	GraphQLTimeSlot
} from '../query';

export default mutationWithClientMutationId({
	name: 'DeleteTimeSlot',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'time slot id'
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
		return DBTimeSlot.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});
