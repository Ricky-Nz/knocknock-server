import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import { DBAdmin } from '../../database';
import { GraphQLAdminEdge, GraphQLViewer } from '../query';
import { getAdminInputs } from '../models';

export default mutationWithClientMutationId({
	name: 'CreateAdmin',
	inputFields: {
		...getAdminInputs()
	},
	outputFields: {
		adminEdge: {
			type: GraphQLAdminEdge,
			resolve: (admin) => ({
				cursor: offsetToCursor(0),
				node: admin
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args) => DBAdmin.create(args)
});