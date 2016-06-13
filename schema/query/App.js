import { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, connectionArgs, toGlobalId } from 'graphql-relay';
import { PromotionBanners, Users, Orders } from '../../service/database';
import { modelConnection, verifyPassword, verifyToken, generateToken } from '../utils';

export default function (nodeInterface, {
	GraphQLBanner,
	GraphQLOrderConnection
}) {
	const GraphQLLoginUser = new GraphQLObjectType({
		name: 'LoginUser',
		fields: {
			id: globalIdField('LoginUser', () => 'LoginUser'),
	  	orders: {
	  		type: GraphQLOrderConnection,
	  		args: {
	  			...connectionArgs
	  		},
	  		resolve: (user, {token, ...args}) =>
	  			modelConnection(Orders, {where:
	  					{$and:{order_status_id:{$notIn:[8, 9]}, user_id: user.id}}, order: 'id DESC'}, args)
	  	},
	  	histories: {
	  		type: GraphQLOrderConnection,
	  		args: {
	  			...connectionArgs
	  		},
	  		resolve: (user, {token, ...args}) =>
	  			modelConnection(Orders, {where:
	  					{$and:{order_status_id:{$in:[8, 9]}, user_id: user.id}}, order: 'id DESC'}, args)
	  	},
      banners: {
        type: new GraphQLList(GraphQLBanner),
        resolve: (user) =>
        	PromotionBanners.findAll({where:{is_enabled:true}, order: 'banner_order', limit: 5})
      }
		},
		interfaces: [nodeInterface]
	});

	const nodeType = new GraphQLObjectType({
	  name: 'App',
	  fields: {
	  	id: globalIdField('App', () => 'APP'),
	  	token: {
	  		type: new GraphQLNonNull(GraphQLString),
	  		args: {
	  			username: {
	  				type: new GraphQLNonNull(GraphQLString)
	  			},
	  			password: {
	  				type: new GraphQLNonNull(GraphQLString)
	  			}
	  		},
	  		resolve: (app, {username, password}) =>
	  			Users.findOne({where:{contact_no:username}})
	  				.then(user => {
	  					if (!user) throw 'username or password not correct';

	  					return verifyPassword(password, user.encrypted_password)
			  				.then(success => {
			  					if (success) {
			  						return generateToken(user.id);
			  					} else {
			  						throw 'username or password not correct';
			  					}
			  				});
	  				})
	  	},
	  	loginUser: {
	  		type: GraphQLLoginUser,
	  		args: {
	  			token: {
	  				type: new GraphQLNonNull(GraphQLString)
	  			}
	  		},
	  		resolve: (user, {token}) => verifyToken(token).then(id => ({id}))
	  	}
	  },
	  interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}