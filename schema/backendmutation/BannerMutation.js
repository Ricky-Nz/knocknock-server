import { GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId, offsetToCursor } from 'graphql-relay';
import { GraphQLBanner, GraphQLBannerEdge, GraphQLViewer } from '../query';
import { PromotionBanners } from '../../service/database';
import { processFileUpload, updateField } from '../utils';
import { deleteFile } from '../../service/datastorage';

   // { id: 3,
   //   banner_name: '1',
   //   banner_title: '1',
   //   banner_description: null,
   //   banner_link: 'http://knocknockapp.com/',
   //   start_date: Tue May 17 2016 00:00:00 GMT+0800 (SGT),
   //   end_date: Fri Jun 10 2016 00:00:00 GMT+0800 (SGT),
   //   is_enabled: null,
   //   created: Wed May 18 2016 13:28:10 GMT+0800 (SGT),
   //   created_by: 'Admin zhang',
   //   updated: Mon May 23 2016 11:34:57 GMT+0800 (SGT),
   //   updated_by: 'Admin zhang',
   //   banner_image_url: 'https://s3-ap-southeast-1.amazonaws.com/knocknock%2Fpromobanners/c4ca4238a0b923820dcc509a6f75849b_1463578339.png',
   //   banner_order: null,
   //   banner_section: 0 },

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
				if (!upload) throw('Upload file failed');

				return PromotionBanners.create({
					is_enabled: enabled,
					banner_title: title,
					banner_link: link,
					banner_order: position,
					banner_image_url: upload.imageUrl,
					created: new Date().toString()
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
				...updateField('is_enabled', enabled),
				...updateField('banner_title', title),
				...updateField('banner_link', link),
				...updateField('banner_order', position),
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

