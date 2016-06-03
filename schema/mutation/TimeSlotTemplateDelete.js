import {
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId,
} from 'graphql-relay';

import {
	DBTimeSlotTemplate
} from '../../database';

import {
	GraphQLViewer
} from '../query';

export default mutationWithClientMutationId({
	name: 'DeleteTimeSlotTemplate',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'time slot tempalte id'
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
		return DBTimeSlotTemplate.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});
