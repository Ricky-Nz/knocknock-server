import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import { DBUser } from '../../database';
import { GraphQLUserEdge, GraphQLViewer } from '../query';
import { getUserInputs } from '../models';
import { processFileUpload } from '../service';

export default mutationWithClientMutationId({
	name: 'CreateUser',
	inputFields: {
		...getUserInputs()
	},
	outputFields: {
		userEdge: {
			type: GraphQLUserEdge,
			resolve: (newUser) => ({
				cursor: offsetToCursor(0),
				node: newUser
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args, context, {rootValue}) =>
		processFileUpload('knocknock-avatar', rootValue.request.file)
			.then(upload => {
				if (upload) {
					args.avatarUrl = upload.imageUrl;
					args.avatarId = args.imageId;
					args.avatarBucket = args.imageBucket;
				}

				return DBUser.create(args);
			})
});