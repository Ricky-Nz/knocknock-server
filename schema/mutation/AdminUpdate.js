import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { DBAdmin } from '../../database';
import { GraphQLAdmin } from '../query';
import { getAdminInputs } from '../models';
import { processFileUpload } from '../service';

export default mutationWithClientMutationId({
	name: 'UpdateAdmin',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'admin id'
		},
		...getAdminInputs(true)
	},
	outputFields: {
		admin: {
			type: GraphQLAdmin,
			resolve: ({localId}) => DBAdmin.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}, context, {rootValue}) =>
		processFileUpload('knocknock-avatar', args, rootValue.request.file)
			.then(upload => {
				if (upload) {
					args.avatarUrl = upload.imageUrl;
					args.avatarId = upload.imageId;
					args.avatarBucket = upload.imageBucket;
				}

				const {id: localId} = fromGlobalId(id);
				return DBAdmin.update(args, {where:{id: localId}})
					.then(() => ({localId}));
			})
});