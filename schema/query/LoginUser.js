import { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, connectionArgs, fromGlobalId, toGlobalId } from 'graphql-relay';
import { PromotionBanners, Users, Orders, UserCredits, UserVouchers, SubCategories, Items } from '../../service/database';
import { modelConnection, verifyPassword, verifyToken, generateToken } from '../utils';

export default function (nodeInterface, {
	GraphQLBanner,
	GraphQLCloth,
	GraphQLCategory,
	GraphQLOrderConnection,
	GraphQLCreditRecordConnection,
	GraphQLAssignedVoucherConnection
}) {
	const nodeType = new GraphQLObjectType({
		name: 'LoginUser',
		fields: {
			id: globalIdField('LoginUser'),
	  	orders: {
	  		type: GraphQLOrderConnection,
	  		args: {
	  			...connectionArgs
	  		},
	  		resolve: (user, args) =>
	  			modelConnection(Orders, {where:{$and:{
	  				order_status_id:{$notIn:[8, 9]},
	  				user_id: user.id
	  			}}, order: 'id DESC'}, args)
	  	},
	  	histories: {
	  		type: GraphQLOrderConnection,
	  		args: {
	  			...connectionArgs
	  		},
	  		resolve: (user, args) =>
	  			modelConnection(Orders, {where:{$and:{
	  				order_status_id:{$in:[8, 9]},
	  				user_id: user.id
	  			}}, order: 'id DESC'}, args)
	  	},
	  	toPayOrders: {
	  		type: GraphQLOrderConnection,
	  		args: {
	  			...connectionArgs
	  		},
	  		resolve: (user, args) =>
	  			modelConnection(Orders, {where:{$and:{
	      		paid:false,
	      		user_id: user.id
	  			}}, order: 'id DESC'}, args)
	  	},
      banners: {
        type: new GraphQLList(GraphQLBanner),
        resolve: (user) =>
        	PromotionBanners.findAll({where:{is_enabled:true}, order: 'banner_order', limit: 5})
      },
      categories: {
        type: new GraphQLList(GraphQLCategory),
        resolve: (user) => SubCategories.findAll({order: 'item_order'})
      },
      clothes: {
      	type: new GraphQLList(GraphQLCloth),
      	args: {
      		categoryId: {
      			type: new GraphQLNonNull(GraphQLString)
      		}
      	},
      	resolve: (user, {categoryId}) => {
      		const {id: localId} = fromGlobalId(categoryId);
      		return Items.findAll({where:{$and:{
		      		disabled: false,
		      		hide_from_user: false,
		      		sub_category_id: localId
		      	}}, order: 'item_order'});
      	}
      },
      creditRecords: {
        type: GraphQLCreditRecordConnection,
        args: {
          ...connectionArgs
        },
        resolve: (user, args) =>
          modelConnection(UserCredits, {where:{user_id: user.id}, order: 'created_on DESC'}, args)
      },
      vouchers: {
        type: GraphQLAssignedVoucherConnection,
        args: {
          ...connectionArgs
        },
        resolve: (user, {all, search, ...args}) =>
          modelConnection(UserVouchers, {where:{user_id: user.id}, order: 'created_on DESC'}, args)
      },
      toPayCount: {
      	type: new GraphQLNonNull(GraphQLInt),
      	resolve: (user) => Orders.count({where:{$and:{
	      		paid:false,
	      		user_id: user.id
	      	}}})
      },
      credits: {
      	type: new GraphQLNonNull(GraphQLString),
      	resolve: (user) =>
      		Users.findById(user.id,{attributes:['credit']}).then(user => `$${user.credit}`)
      },
      voucherCount: {
      	type: new GraphQLNonNull(GraphQLInt),
      	resolve: (user) =>
      		UserVouchers.count({where:{$and:{
      			user_id: user.id,
      			used: false
      		}}})
      }
		},
		interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}