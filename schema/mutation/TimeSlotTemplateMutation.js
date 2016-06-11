import { GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId,} from 'graphql-relay';
import { GraphQLViewer, GraphQLTimeSlotTemplateEdge, GraphQLTimeSlotTemplate } from '../query';
import { DistrictTimeSlots } from '../../service/database';

// id			
// district_id			
// time			
// max_pickup			
// updated			
// created			
// max_dropoff			
// current_pickup			
// current_dropoff

const createTimeSlotTemplate = mutationWithClientMutationId({
	name: 'CreateTimeSlotTemplate',
	inputFields: {
		time: {
			type: new GraphQLNonNull(GraphQLString)
		},
		limit: {
			type: new GraphQLNonNull(GraphQLInt)
		}
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
	mutateAndGetPayload: ({time, limit}) =>
		DistrictTimeSlots.create({
			time,
			max_pickup: limit,
			created: new Date().toString()
		})
});

const updateTimeSlotTemplate = mutationWithClientMutationId({
	name: 'UpdateTimeSlotTemplate',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		},
		time: {
			type: GraphQLString
		},
		limit: {
			type: GraphQLInt
		}
	},
	outputFields: {
		timeSlotTemplate: {
			type: GraphQLTimeSlotTemplate,
			resolve: ({localId}) => TimeSlotTemplate.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, time, limit}) => {
		const {id: localId} = fromGlobalId(id);
		return DistrictTimeSlots.update({
			time,
			max_pickup: limit
		}, {where: {id: localId}}).then(() => ({localId}));
	}
});

const deleteTimeSlotTemplate = mutationWithClientMutationId({
	name: 'DeleteTimeSlotTemplate',
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
		return DistrictTimeSlots.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});

export default {
	createTimeSlotTemplate,
	updateTimeSlotTemplate,
	deleteTimeSlotTemplate
};
