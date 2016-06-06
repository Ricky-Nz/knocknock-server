import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLUserEdge, GraphQLViewer } from '../query';
import { User } from '../models';
import { processFileUpload } from '../service';
import { deleteFile } from '../../datastorage';

const createUser = mutationWithClientMutationId({
	name: 'CreateUser',
	inputFields: {
		...User.inputs
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

				return User.create(args);
			})
});

const updateUser = mutationWithClientMutationId({
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
			resolve: ({localId}) => User.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}, context, {rootValue}) =>
		processFileUpload('knocknock-avatar', rootValue.request.file)
			.then(upload => {
				const {id: localId} = fromGlobalId(id);

				if (upload) {
					args.avatarUrl = upload.imageUrl;
					args.avatarId = upload.imageId;
					args.avatarBucket = upload.imageBucket;

					return User.findById(localId)
						.then(user => deleteFile(user.avatarBucket, user.avatarId))
						.then(() => User.update(args, {where:{id: localId}}))
						.then(() => ({localId}));
				} else {
					return User.update(args, {where:{id: localId}})
						.then(() => ({localId}));
				}
			})
});

export default {
	createUser,
	updateUser
};