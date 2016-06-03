import {
	mutationWithClientMutationId,
	offsetToCursor
} from 'graphql-relay';

import {
	getBannerInputs
} from '../models';

import {
	GraphQLBanner,
	GraphQLBannerEdge,
	GraphQLViewer
} from '../query';

import {
	DBBanner
} from '../../database';

import { processFileUpload } from '../service';

export default mutationWithClientMutationId({
	name: 'CreateBanner',
	inputFields: {
		...getBannerInputs()
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

				return DBBanner.create(args);
			})
});
