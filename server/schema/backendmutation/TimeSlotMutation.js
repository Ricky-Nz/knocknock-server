import { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import { GraphQLTimeSlot } from '../query';
import { OrderSlots } from '../../service/database';
import { updateField } from '../utils';

// id			
// date			
// time			
// quantity			
// created_on

const updateTimeSlot = mutationWithClientMutationId({
	name: 'UpdateTimeSlot',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		},
		date: {
			type: new GraphQLNonNull(GraphQLString)
		},
		time: {
			type: GraphQLString
		},
		quantity: {
			type: GraphQLInt
		}
	},
	outputFields: {
		timeSlot: {
			type: GraphQLTimeSlot,
			resolve: ({localId}) => OrderSlots.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, date, time, quantity, enabled}) => {
		const {id: localId} = fromGlobalId(id);
		return OrderSlots.update({
			...updateField('date', date),
			...updateField('time', time),
			...updateField('quantity', quantity)
		}, {where: {id: localId}}).then(() => ({localId}));
	}
});


export default {
	updateTimeSlot
};