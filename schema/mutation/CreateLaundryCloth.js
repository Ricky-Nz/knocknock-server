import { GraphQLNonNull, GraphQLString, GraphQLFloat,
	GraphQLBoolean, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import { DBLaundryCloth } from '../../database';
import { GraphQLViewer, GraphQLClothEdge, GraphQLClothPagination,
	resolvePagination } from '../query';
import { uploadFile } from '../../datastorage';
import path from 'path';
import fs from 'fs';

export default mutationWithClientMutationId({
	name: 'CreateLaundryCloth',
	inputFields: {
		limit: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'refeach limit'
		},
		nameEn: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'english name'
		},
		nameCn: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'chinese name'
		},
		washPrice: {
			type: new GraphQLNonNull(GraphQLFloat),
			description: 'normal wash price'
		},
		dryCleanPrice: {
			type: new GraphQLNonNull(GraphQLFloat),
			description: 'dry clean price'
		},
		ironPrice: {
			type: new GraphQLNonNull(GraphQLFloat),
			description: 'iron clean price'
		},
		washPriceDiscount: {
			type: GraphQLFloat,
			description: 'normal wash price discount'
		},
		dryCleanPriceDiscount: {
			type: GraphQLFloat,
			description: 'dry clean price discount'
		},
		ironPriceDiscount: {
			type: GraphQLFloat,
			description: 'iron clean price discount'
		},
		special: {
			type: GraphQLBoolean,
			description: 'special item'
		},
		imageUrl: {
			type: GraphQLString,
			description: 'cloth image url'
		}
	},
	outputFields: {
		clothPage: {
			type: GraphQLClothPagination,
			resolve: ({newCloth, limit}) => {
				return resolvePagination(DBLaundryCloth, null, 1, limit);
			}
		}
	},
	mutateAndGetPayload: ({limit, ...args}, context, {rootValue}) => {
		const localFilePath = path.join(__dirname, '..', '..', rootValue.request.file.path);

		return uploadFile(localFilePath)
			.then(file => {
				fs.unlink(localFilePath);
				
				const imageBucket = file.metadata.bucket;
				const imageId = file.id;
				const imageUrl = `https://storage.googleapis.com/${imageBucket}/${imageId}`
				return DBLaundryCloth.create({...args, imageUrl, imageBucket, imageId})
					.then(newCloth => ({newCloth, limit}));
			});
	}
});

