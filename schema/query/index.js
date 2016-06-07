import {
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLBoolean
} from 'graphql';

import {
	connectionArgs,
  cursorToOffset,
  globalIdField,
  toGlobalId,
  fromGlobalId,
  nodeDefinitions,
  connectionDefinitions,
  connectionFromArray
} from 'graphql-relay';

import address from './Address';

import { modelConnection, formatToDay, calculateTimeRnage } from '../service';

class FeakViewerClass {}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'Viewer') {
      return new FeakViewerClass();
    } else if (type === 'User') {
      return User.findById(id);
    } else if (type === 'Admin') {
      return Admin.findById(id);
    } else if (type === 'Worker') {
      return Worker.findById(id);
    } else if (type === 'Address') {
      return Address.findById(id);
    } else if (type === 'Cloth') {
      return Cloth.findById(id);
    } else if (type === 'ClothCategory') {
      return ClothCategory.findById(id);
    } else if (type === 'Voucher') {
      return Voucher.findById(id);
    } else if (type === 'Order') {
      return Order.findById(id);
    } else if (type === 'OrderItem') {
      return OrderItem.findById(id);
    } else if (type === 'Transaction') {
      return Transaction.findById(id);
    } else if (type === 'TimeSlotTemplate') {
      return TimeSlotTemplate.findById(id);
    } else if (type === 'TimeSlot') {
      return TimeSlot.findById(id);
    } else if (type === 'Factory') {
      return Factory.findById(id);
    } else if (type === 'Wallet') {
      return Wallet.findById(id);
    } else if (type === 'PromoCode') {
      return PromoCode.findById(id);
    } else if (type === 'Banner') {
      return Banner.findById(id);
    } else if (type === 'Feedback') {
      return Feedback.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
  	if (obj instanceof FeakViewerClass) {
    	return GraphQLViewer;
    } else if (User.is(obj)) {
  		return GraphQLUser;
  	} else if (Admin.is(obj)) {
      return GraphQLAdmin;
    } else if (Worker.is(obj)) {
      return GraphQLWorker;
    } else if (Address.is(obj)) {
      return GraphQLAddress;
    } else if (Cloth.is(obj)) {
      return GraphQLCloth;
    } else if (ClothCategory.is(obj)) {
      return GraphQLClothCategory;
    } else if (Voucher.is(obj)) {
      return GraphQLVoucher;
    } else if (Order.is(obj)) {
      return GraphQLOrder;
    } else if (OrderItem.is(obj)) {
      return GraphQLOrderItem;
    } else if (Transaction.is(obj)) {
      return GraphQLTransaction;
    } else if (TimeSlotTemplate.is(obj)) {
      return GraphQLTimeSlotTemplate;
    } else if (TimeSlot.is(obj)) {
      return GraphQLTimeSlot;
    } else if (Factory.is(obj)) {
      return GraphQLFactory;
    } else if (Wallet.is(obj)) {
      return GraphQLWallet;
    } else if (PromoCode.is(obj)) {
      return GraphQLPromoCode;
    } else if (Banner.is(obj)) {
      return GraphQLBanner;
    } else if (Feedback.is(obj)) {
      return GraphQLFeedback;
    } else {
  		return null;
  	}
  }
);

export const {
  nodeType: GraphQLAddress,
  connectionType: GraphQLAddressConnection,
  edgeType: GraphQLAddressEdge
} = addressQuery(nodeInterface);

export const {
  nodeType: GraphQLBanner,
  connectionType: GraphQLBannerConnection,
  edgeType: GraphQLBannerEdge
} = bannerQuery(nodeInterface);

export const {
  nodeType: GraphQLPromoCode,
  connectionType: GraphQLPromoCodeConnection,
  edgeType: GraphQLPromoCodeEdge
} = promoCodeQuery(nodeInterface);

export const {
  nodeType: GraphQLFactory,
  connectionType: GraphQLFactoryConnection,
  edgeType: GraphQLFactoryEdge
} = factoryQuery(nodeInterface);

export const {
  nodeType: GraphQLTimeSlotTemplate,
  connectionType: GraphQLTimeSlotTemplateConnection,
  edgeType: GraphQLTimeSlotTemplateEdge
} = timeSlotTemplateQuery(nodeInterface);

export const {
  nodeType: GraphQLTimeSlot,
  connectionType: GraphQLTimeSlotConnection,
  edgeType: GraphQLTimeSlotEdge
} = timeSlotQuery(nodeInterface);

export const {
  nodeType: GraphQLTransaction,
  connectionType: GraphQLTransactionConnection,
  edgeType: GraphQLTransactionEdge
} = transactionQuery(nodeInterface);

export const {
  nodeType: GraphQLClothCategory,
  connectionType: GraphQLClothCategoryConnection,
  edgeType: GraphQLClothCategoryEdge
} = categoryQuery(nodeInterface);

export const {
  nodeType: GraphQLCloth,
  connectionType: GraphQLClothConnection,
  edgeType: GraphQLClothEdge
} = clothQuery(nodeInterface);

export const {
  nodeType: GraphQLVoucher,
  connectionType: GraphQLVoucherConnection,
  edgeType: GraphQLVoucherEdge
} = vouvherQuery(nodeInterface);

export const {
  nodeType: GraphQLOrderItem,
  connectionType: GraphQLOrderItemConnection,
  edgeType: GraphQLOrderItemEdge
} = orderItemQuery(nodeInterface);

export const {
  nodeType: GraphQLOrder,
  connectionType: GraphQLOrderConnection,
  edgeType: GraphQLOrderEdge
} = orderQuery(nodeInterface);

export const {
  nodeType: GraphQLWallet,
  connectionType: GraphQLWalletConnection,
  edgeType: GraphQLWalletEdge
} = walletQuery(nodeInterface);

export const {
  nodeType: GraphQLUser,
  connectionType: GraphQLUserConnection,
  edgeType: GraphQLUserEdge
} = userQuery(nodeInterface);

export const {
  nodeType: GraphQLFeedback,
  connectionType: GraphQLFeedbackConnection,
  edgeType: GraphQLFeedbackEdge
} = feedbackQuery(nodeInterface);

export const {
  nodeType: GraphQLWorker,
  connectionType: GraphQLWorkerConnection,
  edgeType: GraphQLWorkerEdge
} = workerQuery(nodeInterface);

export const {
  nodeType: GraphQLAdmin,
  connectionType: GraphQLAdminConnection,
  edgeType: GraphQLAdminEdge
} = adminQuery(nodeInterface);

export const {
  nodeType: GraphQLViewer
} = vieserQuery(nodeInterface);

export default new GraphQLObjectType({
  name: 'Query',
  description: 'Query root',
  fields: {
    viewer: {
      type: GraphQLViewer,
      resolve: () => new FeakViewerClass()
    },
    node: nodeField
  }
});

