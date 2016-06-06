import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { getPromoCodeInputs } from '../models';
import { PromoCode } from '../../database';
import { GraphQLViewer, GraphQLPromoCodeEdge, GraphQLPromoCode } from '../query';
import { generateCode } from '../service';

const createPromoCode = mutationWithClientMutationId({
	name: 'CreatePromoCode',
	inputFields: {
		...PromoCode.inputs
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
	mutateAndGetPayload: (args) => {
		return PromoCode.create({...args, code: args.code?args.code:generateCode()});
	}
});

const updatePromoCode = mutationWithClientMutationId({
	name: 'UpdatePromoCode',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'update item id'
		},
		...PromoCode.inputs
	},
	outputFields: {
		promoCode: {
			type: GraphQLPromoCode,
			resolve: ({localId}) => PromoCode.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}) => {
		const {id: localId} = fromGlobalId(id);
		return PromoCode.update(args, {where: {id: localId}})
			.then(() => ({localId}));
	}
});

const deletePromoCode = mutationWithClientMutationId({
	name: 'DeletePromoCode',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'code id'
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
		return PromoCode.destroy({where:{id:localId}})
			.then(() => ({id}));
	}
});


export default {
	createPromoCode,
	updatePromoCode,
	deletePromoCode
};