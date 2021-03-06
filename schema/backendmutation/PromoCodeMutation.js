import { GraphQLString, GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLFloat } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLViewer, GraphQLPromoCodeEdge, GraphQLPromoCode } from '../query';
import { PromoCodes } from '../../service/database';
import { updateField } from '../utils';

// id			
// name			
// start_date			
// end_date			
// status			
// limit			
// allow_multiple_use			
// only_app			
// promo_type			
// discount_percent			
// flat_discount			
// created_at			
// created_by			
// updated_at			
// updated_by			
// code			
// remarks			
// user_limit			
// per_user_limit			
// firsttime_user

const createPromoCode = mutationWithClientMutationId({
	name: 'CreatePromoCode',
	inputFields: {
		enabled: {
			type: GraphQLBoolean
		},
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		description: {
			type: GraphQLString
		},
		start: {
			type: new GraphQLNonNull(GraphQLString)
		},
		end: {
			type: new GraphQLNonNull(GraphQLString)
		},
		perUserLimit: {
			type: new GraphQLNonNull(GraphQLInt)
		},
		limit: {
			type: new GraphQLNonNull(GraphQLInt)
		},
		promoType: {
			type: new GraphQLNonNull(GraphQLString)
		},
		flatDiscount: {
			type: GraphQLFloat
		},
		discountPercent: {
			type: GraphQLFloat
		},
		multipleUse: {
			type: GraphQLBoolean
		},
		mobileOnly: {
			type: GraphQLBoolean
		},
		firstTimeUser: {
			type: GraphQLBoolean
		}
	},
	outputFields: {
		promoCodeEdge: {
			type: GraphQLPromoCodeEdge,
			resolve: (code) => ({
				cursor: offsetToCursor(0),
				node: code
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: ({enabled, name, start, end, perUserLimit, limit, promoType,
		discountPercent, flatDiscount, multipleUse, mobileOnly, firstTimeUser}) =>
		PromoCodes.create({
			status: enabled?1:0,
			name,
			remarks: description,
			start_date: start,
			end_date: end,
			per_user_limit: perUserLimit,
			limit,
			promo_type: promoType,
			discount_percent: discountPercent,
			flat_discount: flatDiscount,
			allow_multiple_use: multipleUse,
			only_app: mobileOnly,
			firsttime_user: firstTimeUser
		})
});

const updatePromoCode = mutationWithClientMutationId({
	name: 'UpdatePromoCode',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		},
		enabled: {
			type: GraphQLBoolean
		},
		name: {
			type: GraphQLString
		},
		description: {
			type: GraphQLString
		},
		start: {
			type: GraphQLString
		},
		end: {
			type: GraphQLString
		},
		perUserLimit: {
			type: GraphQLInt
		},
		limit: {
			type: GraphQLInt
		},
		promoType: {
			type: GraphQLString
		},
		flatDiscount: {
			type: GraphQLFloat
		},
		discountPercent: {
			type: GraphQLFloat
		},
		multipleUse: {
			type: GraphQLBoolean
		},
		mobileOnly: {
			type: GraphQLBoolean
		},
		firstTimeUser: {
			type: GraphQLBoolean
		}
	},
	outputFields: {
		promoCode: {
			type: GraphQLPromoCode,
			resolve: ({localId}) => PromoCodes.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, enabled, name, description, start, end, perUserLimit, limit, promoType,
		discountPercent, flatDiscount, multipleUse, mobileOnly, firstTimeUser}) => {
		const {id: localId} = fromGlobalId(id);
		return PromoCodes.update({
			...(enabled!==undefined)&&{
				status: enabled?1:0
			},
			...updateField('name', name),
			...updateField('remarks', description),
			...updateField('start_date', start),
			...updateField('end_date', end),
			...updateField('per_user_limit', perUserLimit),
			...updateField('limit', limit),
			...updateField('promo_type', promoType),
			...updateField('discount_percent', discountPercent),
			...updateField('flat_discount', flatDiscount),
			...updateField('allow_multiple_use', multipleUse),
			...updateField('only_app', mobileOnly),
			...updateField('firsttime_user', firstTimeUser)
		}, {where: {id: localId}}).then(() => ({localId}));
	}
});

const deletePromoCode = mutationWithClientMutationId({
	name: 'DeletePromoCode',
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
	mutateAndGetPayload: ({id}) => {
		const {id: localId} = fromGlobalId(id);
		return PromoCodes.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});


export default {
	createPromoCode,
	updatePromoCode,
	deletePromoCode
};