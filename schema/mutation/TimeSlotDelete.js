import {
	GraphQLList,
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	timeSlotFields
} from '../models';

import {
	DBTimeSlot
} from '../../database';

import {
	GraphQLViewer,
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
		timeSlots: {
			type: new GraphQLList(GraphQLTimeSlot),
			resolve: () => DBTimeSlot.findAll()
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: ({id}) => {
		const {id: localId} = fromGlobalId(id);
		return DBTimeSlot.destroy({where:{id:localId}})
			.then(() => ({}));
	}
});
