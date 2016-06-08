import { GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLViewer, GraphQLVoucher, GraphQLVoucherEdge } from '../query';
import { Vouchers } from '../../service/database';

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
			disabled: !enabled
		})
});

export default {
	createVoucher
};