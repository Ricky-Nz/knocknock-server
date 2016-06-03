import {
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	getBannerInputs
} from '../models';

import { GraphQLBanner } from '../query';
import { processFileUpload } from '../service';
import { DBBanner } from '../../database';
import { deleteFile } from '../../datastorage';

export default mutationWithClientMutationId({
	name: 'UpdateBanner',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'banner id'
		},
		...getBannerInputs(true)
	},
	outputFields: {
		banner: {
			type: GraphQLBanner,
			resolve: ({localId}) => DBBanner.findById(localId)
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

				return DBBanner.findById(localId)
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

