import { GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLCloth, GraphQLClothEdge, GraphQLViewer } from '../query';
import { processFileUpload, updateField } from '../utils';
import { deleteFile } from '../../service/datastorage';
import { Items } from '../../service/database';

// id			
// sub_category_id			
// name_en			
// name_ch			
// wash_iron_price			
// dry_clean_price			
// iron_price			
// discount_wash_iron_price			
// discount_dry_clean_price			
// discount_iron_price			
// have_discount_dry_clean_price			
// have_discount_wash_iron_price			
// have_discount_iron_price			
// image_url			
// created_on			
// disabled			
// item_order			
// special_item			
// hide_from_user			
// description

function clothFields(update) {
	return {
		categoryId: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString)
		},
		nameEn: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString)
		},
		nameCn: {
			type: update ? GraphQLString : new GraphQLNonNull(GraphQLString)
		},
		washPrice: {
			type: GraphQLFloat
		},
		dryCleanPrice: {
			type: GraphQLFloat
		},
		ironPrice: {
			type: GraphQLFloat
		},
		discountWashPrice: {
			type: GraphQLFloat
		},
		discountDryCleanPrice: {
			type: GraphQLFloat
		},
		discountIronPrice: {
			type: GraphQLFloat
		},
		enableWashPriceDiscount: {
			type: GraphQLBoolean
		},
		enableDryCleanPriceDiscount: {
			type: GraphQLBoolean
		},
		enableIronPriceDiscount: {
			type: GraphQLBoolean
		},
		special: {
			type: GraphQLBoolean
		},
		hideFromUser: {
			type: GraphQLBoolean
		},
		enabled: {
			type: GraphQLBoolean
		}
	};
}

const createCloth = mutationWithClientMutationId({
	name: 'CreateCloth',
	inputFields: {
		...clothFields()
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
	mutateAndGetPayload: ({categoryId, nameEn, nameCn, washPrice, dryCleanPrice, ironPrice,
		discountWashPrice, discountDryCleanPrice, discountIronPrice, enableWashPriceDiscount,
		enableDryCleanPriceDiscount, enableIronPriceDiscount, special, hideFromUser, enabled}, context,
		{rootValue}) => processFileUpload('knocknock-laundry', rootValue.request.file)
			.then(upload => {
				if (!upload) throw 'Upload file failed';

				const {id: localCategoryId} = fromGlobalId(categoryId);

				return Items.create({
					sub_category_id: localCategoryId,
					name_en: nameEn,
					name_ch: nameCn,
					wash_iron_price: washPrice,
					dry_clean_price: dryCleanPrice,
					iron_price: ironPrice,
					discount_wash_iron_price: discountWashPrice,
					discount_dry_clean_price: discountDryCleanPrice,
					discount_iron_price: discountIronPrice,
					have_discount_wash_iron_price: enableWashPriceDiscount,
					have_discount_dry_clean_price: enableDryCleanPriceDiscount,
					have_discount_iron_price: enableIronPriceDiscount,
					special_item: special,
					hide_from_user: hideFromUser,
					...(enabled!==undefined)&&{
						disabled: !enabled
					},
					image_url: upload.imageUrl,
					created_on: new Date().toString()
				});
			})
});

const updateCloth = mutationWithClientMutationId({
	name: 'UpdateCloth',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'cloth id'
		},
		...clothFields(true)
	},
	outputFields: {
		cloth: {
			type: GraphQLCloth,
			resolve: ({localId}) => Items.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, categoryId, nameEn, nameCn, washPrice, dryCleanPrice, ironPrice,
		discountWashPrice, discountDryCleanPrice, discountIronPrice, enableWashPriceDiscount,
		enableDryCleanPriceDiscount, enableIronPriceDiscount, special, hideFromUser, enabled}, context, {rootValue}) => {
		const {id: localId} = fromGlobalId(id);

		if (categoryId) {
			const {id: localCategoryId} = fromGlobalId(categoryId);
			categoryId = localCategoryId;
		}

		return processFileUpload('knocknock-laundry', rootValue.request.file)
			.then(upload => Items.update({
				...updateField('sub_category_id', categoryId),
				...updateField('name_en', nameEn),
				...updateField('name_ch', nameCn),
				...updateField('wash_iron_price', washPrice),
				...updateField('dry_clean_price', dryCleanPrice),
				...updateField('iron_price', ironPrice),
				...updateField('discount_wash_iron_price', discountWashPrice),
				...updateField('discount_dry_clean_price', discountDryCleanPrice),
				...updateField('discount_iron_price', discountIronPrice),
				...updateField('have_discount_wash_iron_price', enableWashPriceDiscount),
				...updateField('have_discount_dry_clean_price', enableDryCleanPriceDiscount),
				...updateField('have_discount_iron_price', enableIronPriceDiscount),
				...updateField('special_item', special),
				...updateField('hide_from_user', hideFromUser),
				...(enabled!==undefined)&&{
					disabled: !enabled
				},
				...upload&&{
					image_url: upload.imageUrl
				}
			}, {where:{id: localId}}))
			.then(() => ({localId}));
	}
});

const deleteCloth = mutationWithClientMutationId({
	name: 'DeleteCloth',
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

		return Items.destroy({where:{id: localId}})
			.then(() => ({id}));
	}
});

export default {
	createCloth,
	updateCloth,
	deleteCloth
};

