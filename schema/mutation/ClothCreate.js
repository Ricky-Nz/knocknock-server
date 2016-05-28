import {
	mutationWithClientMutationId,
	offsetToCursor
} from 'graphql-relay';

import {
	getClothInputs
} from '../models';

import {
	GraphQLCloth,
	GraphQLClothEdge,
	GraphQLViewer
} from '../query';

import {
	DBCloth
} from '../../database';

import { processFileUpload } from '../service';

export default mutationWithClientMutationId({
	name: 'CreateCloth',
	inputFields: {
		...getClothInputs()
	},
	outputFields: {
		clothEdge: {
			type: GraphQLClothEdge,
			resolve: (newCloth) => ({
				cursor: offsetToCursor(0),
				node: newCloth
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: (args, context, {rootValue}) =>
		processFileUpload('knocknock-laundry', rootValue.request.file)
			.then(upload => {
				if (upload) {
					args.imageUrl = upload.imageUrl;
					args.imageId = upload.imageId;
					args.imageBucket = upload.imageBucket;
				}

				return DBCloth.create(args);
			})
});
