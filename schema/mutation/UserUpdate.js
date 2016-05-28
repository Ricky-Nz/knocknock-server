import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { DBUser } from '../../database';
import { GraphQLUser } from '../query';
import { getUserInputs } from '../models';
import { processFileUpload } from '../service';

export default mutationWithClientMutationId({
	name: 'UpdateUser',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'user id'
		},
		...getUserInputs(true)
	},
	outputFields: {
		user: {
			type: GraphQLUser,
			resolve: ({localId}) => DBUser.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}, context, {rootValue}) =>
		processFileUpload('knocknock-avatar', rootValue.request.file)
			.then(upload => {
				if (upload) {
					args.avatarUrl = upload.imageUrl;
					args.avatarId = upload.imageId;
					args.avatarBucket = upload.imageBucket;
				}

				const {id: localId} = fromGlobalId(id);
				return DBUser.update(args, {where:{id: localId}})
					.then(() => ({localId}));
			})
});