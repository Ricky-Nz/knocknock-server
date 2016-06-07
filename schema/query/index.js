import { GraphQLObjectType } from 'graphql';
import { nodeDefinitions } from 'graphql-relay';
import { Users, Admins, Workers, UserAddresses, Items, SubCategories,
  Vouchers, Orders, OrderDetails, OrderTransactions, OrderSlots, DistrictTimeSlots,
  Factories, PromoCodes, PromoionBanners, UserFeedbacks } from '../../service/database';
import addressQuery from './Address';
import adminQuery from './Admin';
import bannerQuery from './Banner';
import categoryQuery from './Category';
import clothQuery from './Cloth';
import factoryQuery from './Factory';
import feedbackQuery from './Feedback';
import orderQuery from './Order';
import orderItemQuery from './OrderItem';
import promoCodeQuery from './PromoCode';
import timeSlotQuery from './TimeSlot';
import timeSlotTemplateQuery from './TimeSlotTemplate';
import transactionQuery from './Transaction';
import userQuery from './User';
import viewerQuery from './Viewer';
import voucherQuery from './Voucher';
import workerQuery from './Worker';

class Viewer {}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'Viewer') {
      return new Viewer();
    } else if (type === 'User') {
      return Users.findById(id);
    } else if (type === 'Admin') {
      return Admins.findById(id);
    } else if (type === 'Worker') {
      return Workers.findById(id);
    } else if (type === 'Address') {
      return UserAddresses.findById(id);
    } else if (type === 'Cloth') {
      return Items.findById(id);
    } else if (type === 'ClothCategory') {
      return SubCategories.findById(id);
    } else if (type === 'Voucher') {
      return Vouchers.findById(id);
    } else if (type === 'Order') {
      return Orders.findById(id);
    } else if (type === 'OrderItem') {
      return OrderDetails.findById(id);
    } else if (type === 'Transaction') {
      return OrderTransactions.findById(id);
    } else if (type === 'TimeSlotTemplate') {
      return DistrictTimeSlots.findById(id);
    } else if (type === 'TimeSlot') {
      return OrderSlots.findById(id);
    } else if (type === 'Factory') {
      return Factories.findById(id);
    } else if (type === 'PromoCode') {
      return PromoCodes.findById(id);
    } else if (type === 'Banner') {
      return PromoionBanners.findById(id);
    } else if (type === 'Feedback') {
      return UserFeedbacks.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
  	if (obj instanceof Viewer) {
    	return GraphQLViewer;
    } else if (obj instanceof Users) {
  		return GraphQLUser;
  	} else if (obj instanceof Admins) {
      return GraphQLAdmin;
    } else if (obj instanceof Workers) {
      return GraphQLWorker;
    } else if (obj instanceof UserAddresses) {
      return GraphQLAddress;
    } else if (obj instanceof Items) {
      return GraphQLCloth;
    } else if (obj instanceof SubCategories) {
      return GraphQLClothCategory;
    } else if (obj instanceof Vouchers) {
      return GraphQLVoucher;
    } else if (obj instanceof Orders) {
      return GraphQLOrder;
    } else if (obj instanceof OrderDetails) {
      return GraphQLOrderItem;
    } else if (obj instanceof OrderTransactions) {
      return GraphQLTransaction;
    } else if (obj instanceof DistrictTimeSlots) {
      return GraphQLTimeSlotTemplate;
    } else if (obj instanceof OrderSlots) {
      return GraphQLTimeSlot;
    } else if (obj instanceof Factories) {
      return GraphQLFactory;
    } else if (obj instanceof PromoCodes) {
      return GraphQLPromoCode;
    } else if (obj instanceof PromoionBanners) {
      return GraphQLBanner;
    } else if (obj instanceof UserFeedbacks) {
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
} = voucherQuery(nodeInterface);

export const {
  nodeType: GraphQLOrderItem,
  connectionType: GraphQLOrderItemConnection,
  edgeType: GraphQLOrderItemEdge
} = orderItemQuery(nodeInterface);

export const {
  nodeType: GraphQLOrder,
  connectionType: GraphQLOrderConnection,
  edgeType: GraphQLOrderEdge
} = orderQuery(nodeInterface, {GraphQLOrderItemConnection});

export const {
  nodeType: GraphQLUser,
  connectionType: GraphQLUserConnection,
  edgeType: GraphQLUserEdge
} = userQuery(nodeInterface, {
  GraphQLAddressConnection,
  GraphQLVoucherConnection,
  GraphQLTransactionConnection,
  GraphQLOrderConnection,
  GraphQLOrder
});

export const {
  nodeType: GraphQLFeedback,
  connectionType: GraphQLFeedbackConnection,
  edgeType: GraphQLFeedbackEdge
} = feedbackQuery(nodeInterface, {GraphQLUser});

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
} = viewerQuery(nodeInterface, {
  GraphQLUser,
  GraphQLWorker,
  GraphQLAdmin,
  GraphQLCloth,
  GraphQLUserConnection,
  GraphQLWorkerConnection,
  GraphQLAdminConnection,
  GraphQLOrderConnection,
  GraphQLTransactionConnection,
  GraphQLClothConnection,
  GraphQLClothCategoryConnection,
  GraphQLTimeSlotTemplateConnection,
  GraphQLTimeSlotConnection,
  GraphQLFactoryConnection,
  GraphQLPromoCodeConnection,
  GraphQLBannerConnection,
  GraphQLFeedbackConnection
});

export default new GraphQLObjectType({
  name: 'Query',
  description: 'Query root',
  fields: {
    viewer: {
      type: GraphQLViewer,
      resolve: () => new Viewer()
    },
    node: nodeField
  }
});

