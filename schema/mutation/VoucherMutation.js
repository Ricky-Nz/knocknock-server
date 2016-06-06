import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { User, Voucher } from '../models';
import { GraphQLUser, GraphQLVoucher, GraphQLVoucherEdge } from '../query';

const createVoucher = mutationWithClientMutationId({
	name: 'CreateVoucher',
	inputFields: {
		...Voucher.inputs
	},
	outputFields: {
		voucherEdge: {
			type: GraphQLVoucherEdge,
			resolve: (voucher) => ({
				cursor: offsetToCursor(0),
				node: voucher
			})
		},
		user: {
			type: GraphQLUser,
			resolve: (voucher) => {
				const {id: localId} = fromGlobalId(voucher.userId);
				return User.findById(localId);
			}
		}
	},
	mutateAndGetPayload: (args) => Voucher.create(args)
});

export default {
	createVoucher
};