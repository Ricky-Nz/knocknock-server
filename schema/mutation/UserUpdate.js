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
		processFileUpload(args, rootValue.request.file)
			.then(args => {
				if (args.imageId && args.imageBucket && args.imageUrl) {
					args.avatarUrl = args.imageUrl;
					args.avatarId = args.imageId;
					args.avatarBucket = args.imageBucket;
					delete args.imageUrl;
					delete args.imageId;
					delete args.imageBucket;
				}

				const {id: localId} = fromGlobalId(id);

				return DBUser.update(args, {where:{id: localId}})
					.then(() => ({localId}));
			})
});