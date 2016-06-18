import { GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, toGlobalId, offsetToCursor } from 'graphql-relay';
import { GraphQLOrder, GraphQLOrderEdge, GraphQLUser, GraphQLOrderItemInput } from '../query';
import { Users, Orders, OrderDetails, Items } from '../../service/database';
import { updateField, prepareOrderItems } from '../utils';

// id      
// pickup_worker_id      
// drop_off_worker_id      
// user_id     
// order_status_id     
// drop_off_district_id      
// pickup_district_id      
// factory_id      
// description     
// lazy_order      
// express_order     
// total_price     
// pickup_address      
// pickup_postal_code      
// pickup_apartment_type     
// drop_off_address      
// drop_off_postal_code      
// drop_off_apartment_type     
// speed_rating      
// attitude_rating     
// created_on      
// pickup_date     
// pickup_time     
// drop_off_date     
// drop_off_time     
// review      
// pickup_changed      
// deliver_changed     
// paypal_ref_no     
// paid      
// pay_later     
// payment_mode      
// to_pay_price      
// voucher_id      
// free      
// worker_checked      
// user_checked      
// order_source_id     
// qr_code_url     
// factory_worker_id     
// factory_received_date     
// factory_completed_date      
// is_merged     
// signature_url     
// merged_order_ids      
// is_imported     
// is_mergable     
// order_number      
// pickup_contact_no     
// drop_off_contact_no     
// recurring_order_id      
// promo_code_id     
// promo_discount      
// voucher_discount      
// pickup_time_end     
// drop_off_time_end     
// pickup_unit_number      
// drop_off_unit_number      
// drop_off_description      
// pickup_address_name     
// drop_off_address_name

// id			
// order_id			
// item_id			
// quantity			
// laundry_type			
// price

const createOrder = mutationWithClientMutationId({
	name: 'CreateOrder',
	inputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    express: {
      type: GraphQLBoolean
    },
    note: {
      type: GraphQLString
    },
    statusId: {
      type: GraphQLString
    },
    pickupDate: {
      type: new GraphQLNonNull(GraphQLString)
    },
    pickupTime: {
      type: new GraphQLNonNull(GraphQLString)
    },
    pickupAddress: {
      type: new GraphQLNonNull(GraphQLString)
    },
    pickupWorkerId: {
      type: GraphQLString
    },
    factoryId: {
    	type: GraphQLString
    },
		orderItems: {
			type: new GraphQLList(GraphQLOrderItemInput)
		}
	},
	outputFields: {
		orderEdge: {
			type: GraphQLOrderEdge,
			resolve: (order) => ({
				cursor: offsetToCursor(0),
				node: order
			})
		},
		user: {
			type: GraphQLUser,
			resolve: (order) => Users.findById(order.user_id)
		}
	},
	mutateAndGetPayload: ({userId, express, note, statusId, pickupDate,
		pickupTime, pickupAddress, pickupWorkerId, factoryId, orderItems}) => {
		const {id: localUserId} = fromGlobalId(userId);

		if (pickupWorkerId) {
			const {id: localWorkerId} = fromGlobalId(pickupWorkerId);
			pickupWorkerId = localWorkerId;
		}
		if (statusId) {
			const {id: localStatusId} = fromGlobalId(statusId);
			statusId = localStatusId;
		}
		if (factoryId) {
			const {id: localFactoryId} = fromGlobalId(factoryId);
			factoryId = localFactoryId;
		}

		return Orders.create({
				user_id: localUserId,
				express_order: express,
				description: note,
				order_status_id: statusId,
				pickup_date: pickupDate,
				pickup_time: pickupTime,
				pickup_address: pickupAddress,
				pickup_worker_id: pickupWorkerId,
				factory_id: factoryId
			})
			.then(order => {
				if (!orderItems || orderItems.length === 0) {
					return order;
				} else {
					return prepareOrderItems(order.id, orderItems)
						.then(items => OrderDetails.bulkCreate(items))
						.then(() => order);
				}
			})
	}
});

const updateOrder = mutationWithClientMutationId({
	name: 'UpdateOrder',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		},
    express: {
      type: GraphQLBoolean
    },
    note: {
      type: GraphQLString
    },
    statusId: {
      type: GraphQLString
    },
    pickupDate: {
      type: GraphQLString
    },
    pickupTime: {
      type: GraphQLString
    },
    pickupAddress: {
      type: GraphQLString
    },
    pickupWorkerId: {
      type: GraphQLString
    },
    factoryId: {
    	type: GraphQLString
    },
    toPayPrice: {
    	type: GraphQLFloat
    },
		orderItems: {
			type: new GraphQLList(GraphQLOrderItemInput)
		}
	},
	outputFields: {
		order: {
			type: GraphQLOrder,
			resolve: ({localId}) => Orders.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, express, note, statusId, pickupDate,
		pickupTime, pickupAddress, pickupWorkerId, factoryId, toPayPrice, orderItems}) => {
		const {id: localId} = fromGlobalId(id);
		
		if (pickupWorkerId) {
			const {id: localWorkerId} = fromGlobalId(pickupWorkerId);
			pickupWorkerId = localWorkerId;
		}
		if (statusId) {
			const {id: localStatusId} = fromGlobalId(statusId);
			statusId = localStatusId;
		}
		if (factoryId) {
			const {id: localFactoryId} = fromGlobalId(factoryId);
			factoryId = localFactoryId;
		}

		return Orders.update({
			...updateField('express_order', express),
			...updateField('description', note),
			...updateField('order_status_id', statusId),
			...updateField('pickup_date', pickupDate),
			...updateField('pickup_time', pickupTime),
			...updateField('pickup_address', pickupAddress),
			...updateField('pickup_worker_id', pickupWorkerId),
			...updateField('factory_id', factoryId),
			...updateField('to_pay_price', toPayPrice)
		}, {where:{id: localId}}).then(() => {
			if (orderItems) {
				return OrderDetails.destroy({where:{order_id: localId}})
					.then(() => {
						if (orderItems.length > 0) {
							return prepareOrderItems(localId, orderItems)
								.then(items => OrderDetails.bulkCreate(items))
								.then(() => localId);
						} else {
							return localId;
						}
					})
					.then(localId => ({localId}));
			} else {
				return {localId};
			}
		});
	}
});

export default {
	createOrder,
	updateOrder
}


