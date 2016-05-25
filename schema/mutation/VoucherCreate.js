import {
	mutationWithClientMutationId,
	offsetToCursor,
	fromGlobalId,
} from 'graphql-relay';

import {
	getVoucherInputs
} from '../models';

import {
	DBUser,
	DBVoucher
} from '../../database';

import {
	GraphQLUser,
	GraphQLVoucher,
	GraphQLVoucherEdge
} from '../query';

export default mutationWithClientMutationId({
	name: 'CreateVoucher',
	inputFields: {
		...getVoucherInputs()
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
				return DBUser.findById(localId);
			}
		}
	},
	mutateAndGetPayload: (args) => DBVoucher.create(args)
});
