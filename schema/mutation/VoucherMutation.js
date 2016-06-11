import { GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLViewer, GraphQLVoucher, GraphQLVoucherEdge } from '../query';
import { Vouchers } from '../../service/database';
import { updateField } from '../utils';

// id			
// title			
// value			
// expire_on			
// created_on			
// disabled			
// seen

const createVoucher = mutationWithClientMutationId({
	name: 'CreateVoucher',
	inputFields: {
		title: {
			type: new GraphQLNonNull(GraphQLString)
		},
		value: {
			type: new GraphQLNonNull(GraphQLFloat)
		},
		expireOn: {
			type: new GraphQLNonNull(GraphQLString)
		},
		enabled: {
			type: new GraphQLNonNull(GraphQLBoolean)
		}
	},
	outputFields: {
		voucherEdge: {
			type: GraphQLVoucherEdge,
			resolve: (voucher) => ({
				cursor: offsetToCursor(0),
				node: voucher
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: ({title, value, expireOn, enabled}) =>
		Vouchers.create({
			title,
			value,
			expire_on: expireOn,
			disabled: !enabled,
			created_on: new Date().toString()
		})
});

const updateVoucher = mutationWithClientMutationId({
	name: 'UpdateVoucher',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		},
		title: {
			type: GraphQLString
		},
		value: {
			type: GraphQLFloat
		},
		expireOn: {
			type: GraphQLString
		},
		enabled: {
			type: GraphQLBoolean
		}
	},
	outputFields: {
		voucher: {
			type: GraphQLVoucher,
			resolve: ({localId}) => Vouchers.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, title, value, expireOn, enabled}) => {
		const {id: localId} = fromGlobalId(id);
		return Vouchers.update({
			...updateField('title', title),
			...updateField('value', value),
			...updateField('expire_on', expireOn),
			...(enabled!==undefined)&&{
				disabled: !enabled
			}
		}, {where:{id: localId}}).then(() => ({localId}));
	}
});

const deleteVoucher = mutationWithClientMutationId({
	name: 'DeleteVoucher',
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
		return Vouchers.destroy({where:{id:localId}}).then(() => ({id}));
	}
});

export default {
	createVoucher,
	updateVoucher,
	deleteVoucher
};