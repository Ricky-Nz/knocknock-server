import {
	GraphQLString,
	GraphQLNonNull
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	getTimeSlotTemplateInputs
} from '../models';

import {
	GraphQLTimeSlotTemplate
} from '../query';

import {
	DBTimeSlotTemplate
} from '../../database';

export default mutationWithClientMutationId({
	name: 'UpdateTimeSlotTemplate',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...getTimeSlotTemplateInputs(true)
	},
	outputFields: {
		timeSlotTemplate: {
			type: GraphQLTimeSlotTemplate,
			resolve: ({localId}) => DBTimeSlotTemplate.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return DBTimeSlotTemplate.update(args, {where: {id: localId}})
			.then(() => ({localId}));
	}
});
