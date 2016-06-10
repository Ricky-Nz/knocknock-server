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

const createCloth = mutationWithClientMutationId({
	name: 'CreateCloth',
	inputFields: {
		categoryId: {
			type: new GraphQLNonNull(GraphQLString)
		},
		nameEn: {
			type: new GraphQLNonNull(GraphQLString)
		},
		nameCn: {
			type: new GraphQLNonNull(GraphQLString)
		},
		washPrice: {
			type: new GraphQLNonNull(GraphQLFloat)
		},
		dryCleanPrice: {
			type: new GraphQLNonNull(GraphQLFloat)
		},
		ironPrice: {
			type: new GraphQLNonNull(GraphQLFloat)
		},
		washPriceDiscount: {
			type: new GraphQLNonNull(GraphQLFloat)
		},
		dryCleanPriceDiscount: {
			type: new GraphQLNonNull(GraphQLFloat)
		},
		ironPriceDiscount: {
			type: new GraphQLNonNull(GraphQLFloat)
		},
		special: {
			type: GraphQLBoolean
		}
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
		washPriceDiscount, dryCleanPriceDiscount, ironPriceDiscount, special}, context, {rootValue}) =>
		processFileUpload('knocknock-laundry', rootValue.request.file)
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
					discount_wash_iron_price: washPriceDiscount,
					discount_dry_clean_price: dryCleanPriceDiscount,
					discount_iron_price: ironPriceDiscount,
					special_item: special,
					image_url: upload.imageUrl
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
		categoryId: {
			type: GraphQLString
		},
		nameEn: {
			type: GraphQLString
		},
		nameCn: {
			type: GraphQLString
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
		washPriceDiscount: {
			type: GraphQLFloat
		},
		dryCleanPriceDiscount: {
			type: GraphQLFloat
		},
		ironPriceDiscount: {
			type: GraphQLFloat
		},
		special: {
			type: GraphQLBoolean
		}
	},
	outputFields: {
		cloth: {
			type: GraphQLCloth,
			resolve: ({localId}) => Items.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, categoryId, nameEn, nameCn, washPrice, dryCleanPrice, ironPrice,
		washPriceDiscount, dryCleanPriceDiscount, ironPriceDiscount, special}, context, {rootValue}) => {
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
				...updateField('discount_wash_iron_price', washPriceDiscount),
				...updateField('discount_dry_clean_price', dryCleanPriceDiscount),
				...updateField('discount_iron_price', ironPriceDiscount),
				...updateField('special_item', special),
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

