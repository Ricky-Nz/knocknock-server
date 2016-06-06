import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId,} from 'graphql-relay';
import { TimeSlotTemplate } from '../models';
import { GraphQLViewer, GraphQLTimeSlotTemplateEdge, GraphQLTimeSlotTemplate } from '../query';

const createTimeSlotTemplate = mutationWithClientMutationId({
	name: 'CreateTimeSlotTemplate',
	inputFields: {
		...TimeSlotTemplate.inputs
	},
	outputFields: {
		timeSlotTemplateEdge: {
			type: GraphQLTimeSlotTemplateEdge,
			resolve: (slot) => ({
				cursor: offsetToCursor(0),
				node: slot
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => TimeSlotTemplate.create(args)
});

const updateTimeSlotTemplate = mutationWithClientMutationId({
	name: 'UpdateTimeSlotTemplate',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...TimeSlotTemplate.updates
	},
	outputFields: {
		timeSlotTemplate: {
			type: GraphQLTimeSlotTemplate,
			resolve: ({localId}) => TimeSlotTemplate.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return TimeSlotTemplate.update(args, {where: {id: localId}})
			.then(() => ({localId}));
	}
});

const deleteTimeSlotTemplate = mutationWithClientMutationId({
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

export default {
	createTimeSlotTemplate,
	updateTimeSlotTemplate,
	deleteTimeSlotTemplate
};
