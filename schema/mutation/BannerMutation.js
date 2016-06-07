import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { GraphQLBanner, GraphQLBannerEdge, GraphQLViewer } from '../query';
import { Banner } from '../models';
import { processFileUpload } from '../service';
import { deleteFile } from '../../service/datastorage';

const createBanner = mutationWithClientMutationId({
	name: 'CreateBanner',
	inputFields: {
		...Banner.inputs
	},
	outputFields: {
		bannerEdge: {
			type: GraphQLBannerEdge,
			resolve: (banner) => ({
				cursor: offsetToCursor(0),
				node: banner
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args, context, {rootValue}) =>
		processFileUpload('knocknock-banner', rootValue.request.file)
			.then(upload => {
				if (upload) {
					args.imageUrl = upload.imageUrl;
					args.imageId = upload.imageId;
					args.imageBucket = upload.imageBucket;
				}

				return Banner.create(args);
			})
});

const updateBanner = mutationWithClientMutationId({
	name: 'UpdateBanner',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'banner id'
		},
		...Banner.updates
	},
	outputFields: {
		banner: {
			type: GraphQLBanner,
			resolve: ({localId}) => Banner.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, ...args}, context, {rootValue}) => {
		const {id: localId} = fromGlobalId(id);

		return processFileUpload('knocknock-banner', rootValue.request.file)
			.then(upload => {
				if (upload) {
					args.imageUrl = upload.imageUrl;
					args.imageId = upload.imageId;
					args.imageBucket = upload.imageBucket;
				}

				return Banner.findById(localId)
						.then(banner => ({banner, args}))
			})
			.then(({banner, args}) => {
				if (banner.imageId && banner.imageBucket
					&& banner.imageId && banner.imageId !== banner.imageId) {
					return deleteFile(banner.imageBucket, banner.imageId)
						.then(() => banner.update(args))
						.catch(() => banner.update(args));
				} else {
					return banner.update(args); 
				}
			})
			.then(() => ({localId}));
	}
});

const deleteBanner = mutationWithClientMutationId({
	name: 'DeleteBanner',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'banner id'
		}
	},
	outputFields: {
		deletedId: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({id}) => id
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: ({id}) => {
		const {id: localId} = fromGlobalId(id);

		return Banner.findById(localId)
			.then(banner => {
				if (banner.imageId && banner.imageBucket) {
					return deleteFile(banner.imageBucket, banner.imageId)
						.then(() => banner)
						.catch(() => banner);
				} else {
					return banner;
				}
			})
			.then(banner => banner.destroy())
			.then(() => ({id}));
	}
});

export default {
	createBanner,
	updateBanner,
	deleteBanner
};

