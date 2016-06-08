import { GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { GraphQLBanner, GraphQLBannerEdge, GraphQLViewer } from '../query';
import { PromotionBanners } from '../../service/database';
import { processFileUpload } from '../utils';
import { deleteFile } from '../../service/datastorage';

// id			
// banner_name			
// banner_title			
// banner_description			
// banner_link			
// start_date			
// end_date			
// is_enabled			
// created			
// created_by			
// updated			
// updated_by			
// banner_image_url			
// banner_order			
// banner_section

const createBanner = mutationWithClientMutationId({
	name: 'CreateBanner',
	inputFields: {
		enabled: {
			type: GraphQLBoolean
		},
		title: {
			type: new GraphQLNonNull(GraphQLString)
		},
		link: {
			type: GraphQLString
		},
		position: {
			type: new GraphQLNonNull(GraphQLInt)
		}
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
	mutateAndGetPayload: ({enabled, title, link, position}, context, {rootValue}) =>
		processFileUpload('knocknock-banner', rootValue.request.file)
			.then(upload => {
				if (!upload) throw('Upload file failed')

				return PromotionBanners.create({
					is_enabled: enabled,
					banner_title: title,
					banner_link: link,
					banner_order: position,
					banner_image_url: upload.imageUrl,
					created: new Date()
				});
			})
});

const updateBanner = mutationWithClientMutationId({
	name: 'UpdateBanner',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'banner id'
		},
		enabled: {
			type: GraphQLBoolean
		},
		title: {
			type: GraphQLString
		},
		link: {
			type: GraphQLString
		},
		position: {
			type: GraphQLInt
		}
	},
	outputFields: {
		banner: {
			type: GraphQLBanner,
			resolve: ({localId}) => PromotionBanners.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, enabled, title, link, position}, context, {rootValue}) => {
		const {id: localId} = fromGlobalId(id);

		return processFileUpload('knocknock-banner', rootValue.request.file)
			.then(upload => PromotionBanners.update({
				is_enabled: enabled,
				banner_title: title,
				banner_link: link,
				banner_order: position,
				...upload&&{
					banner_image_url: upload.imageUrl
				}
			}, {where:{id: localId}})).then(() => ({localId}))
	}
});

const deleteBanner = mutationWithClientMutationId({
	name: 'DeleteBanner',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
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

		return PromotionBanners.destroy({where:{id: localId}})
			.then(() => ({id}));
	}
});

export default {
	createBanner,
	updateBanner,
	deleteBanner
};

