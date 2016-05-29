import {
	GraphQLNonNull,
	GraphQLInt,
	GraphQLList
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId,
	toGlobalId,
	offsetToCursor
} from 'graphql-relay';

import {
	getOrderInputs
} from '../models';

import {
	GraphQLOrder,
	GraphQLOrderItemInput,
	GraphQLOrderEdge,
	GraphQLUser
} from '../query';

import { DBOrder, DBUser, DBOrderItem, DBCloth } from '../../database';

import { calculateOrderId, formatDate } from '../service';

export default mutationWithClientMutationId({
	name: 'CreateOrder',
	inputFields: {
		...getOrderInputs(),
		orderItems: {
			type: new GraphQLList(GraphQLOrderItemInput),
			description: 'order items'
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
			resolve: (order) => {
				const {id: localId} = fromGlobalId(order.userId);
				return DBUser.findById(localId);
			}
		}
	},
	mutateAndGetPayload: ({orderItems, ...args}) =>
		calculateOrderId(args.userId)
			.then(serialNumber => {
				return DBOrder.create({...args, pickupDate: formatDate(args.pickupDate), serialNumber});
			})
			.then(order => {
				if (!orderItems || orderItems.length === 0) {
					return order;
				} else {
					const clothIds = orderItems.map(item => {
						const {id} = fromGlobalId(item.productId);
						return id;
					});

					return DBCloth.findAll({where:{id:{$in:clothIds}}})
						.then(clothes => {
							const bulkItems = orderItems.map(item => {
								const {id: localClothId} = fromGlobalId(item.productId);
								const cloth = clothes.find(cloth => cloth.id == localClothId);
								
								let itemPrice;
								switch(item.washType) {
									case 'Wash&Iron':
										itemPrice = cloth.washPrice;
										break;
									case 'Dry Clean':
										itemPrice = cloth.dryCleanPrice;
										break;
									case 'Iron':
										itemPrice = cloth.ironPrice;
										break;
								}

								return {
									...item,
									serialNumber: order.serialNumber,
									itemPrice,
									itemNameCn: cloth.nameCn,
									itemNameEn: cloth.nameEn,
									itemImageUrl: cloth.imageUrl
								};
							});

							return DBOrderItem.bulkCreate(bulkItems);
						})
						.then(() => order);
				}
			})
});
