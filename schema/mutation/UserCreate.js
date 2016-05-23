import { GraphQLNonNull, GraphQLString } from 'graphql';
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
		processFileUpload(args, rootValue.request.file)
			.then(args => {
				args.avatarUrl = args.imageUrl;
				args.avatarId = args.imageId;
				args.avatarBucket = args.imageBucket;
				delete args.imageUrl;
				delete args.imageId;
				delete args.imageBucket;

				return DBUser.create(args);
			})
});