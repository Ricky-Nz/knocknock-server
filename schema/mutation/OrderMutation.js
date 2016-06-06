import { GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, toGlobalId, offsetToCursor } from 'graphql-relay';
import { User, Order, OrderItem, Cloth } from '../models';
import { GraphQLOrder, GraphQLOrderItemInput, GraphQLOrderEdge, GraphQLUser } from '../query';
import { calculateOrderId, formatDate } from '../service';

const createOrder = mutationWithClientMutationId({
	name: 'CreateOrder',
	inputFields: {
		...Order.inputs,
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
				return User.findById(localId);
			}
		}
	},
	mutateAndGetPayload: ({orderItems, ...args}) =>
		calculateOrderId(args.userId)
			.then(serialNumber => {
				return Order.create({...args, pickupDate: formatDate(args.pickupDate), serialNumber});
			})
			.then(order => {
				if (!orderItems || orderItems.length === 0) {
					return order;
				} else {
					const clothIds = orderItems.map(item => {
						const {id} = fromGlobalId(item.productId);
						return id;
					});

					return Cloth.findAll({where:{id:{$in:clothIds}}})
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

							return OrderItem.bulkCreate(bulkItems);
						})
						.then(() => order);
				}
			})
});

const updateOrder = mutationWithClientMutationId({
	name: 'UpdateOrder',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update order id'
		},
		...Order.updates
	},
	outputFields: {
		order: {
			type: GraphQLOrder,
			resolve: ({localId}) => Order.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return Order.update(args, {where:{id: localId}})
			.then(() => ({localId}));
	}
});

export default {
	createOrder,
	updateOrder
}


