import {
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	mutationWithClientMutationId,
	fromGlobalId
} from 'graphql-relay';

import {
	GraphQLViewer
} from '../query';

import {
	DBBanner
} from '../../database';

import { deleteFile } from '../../datastorage';

export default mutationWithClientMutationId({
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

		return DBBanner.findById(localId)
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

