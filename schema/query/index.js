import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { nodeDefinitions, fromGlobalId, toGlobalId } from 'graphql-relay';
import { Users, Admins, Workers, UserAddresses, Items, SubCategories,
  Vouchers, Orders, OrderDetails, OrderTransactions, OrderSlots, DistrictTimeSlots,
  Factories, PromoCodes, PromoionBanners, UserFeedbacks, OrderStatuses } from '../../service/database';
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
import appQuery from './App';
import voucherQuery from './Voucher';
import assignedVoucherQuery from './AssignedVoucher';
import workerQuery from './Worker';
import orderStatusQuery from './OrderStatus';
import creditRecordQuery from './CreditRecord';
import loginUserQuery from './LoginUser';

class Viewer {}
class App {}
class LoginUser {}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'Viewer') {
      return new Viewer();
    } else if (type === 'App') {
      return new App();
    } else if (type === 'LoginUser') {
      let loginUser = new LoginUser();
      loginUser.id = id;
      return loginUser;
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
    } else if (type === 'AssignedVoucher') {
      return AssignedVoucher.findById(id);
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
    } else if (type === 'OrderStatus') {
      return OrderStatuses.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
  	if (obj instanceof Viewer) {
    	return GraphQLViewer;
    } else if (obj instanceof App) {
      return GraphQLApp;
    } else if (obj instanceof LoginUser) {
      return GraphQLLoginUser;
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
    } else if (obj instanceof AssignedVoucher) {
      return GraphQLAssignedVoucher;
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
    } else if (obj instanceof OrderStatuses) {
      return GraphQLOrderStatus;
    } else {
  		return null;
  	}
  }
);

const GraphQLUserRef = new GraphQLObjectType({
  name: 'UserRef',
  fields: {
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (obj) => toGlobalId('User', obj.id)
    },
    firstName: {
      type: GraphQLString,
      resolve: (obj) => obj.first_name
    },
    lastName: {
      type: GraphQLString,
      resolve: (obj) => obj.last_name
    },
    email: {
      type: GraphQLString,
      resolve: (obj) => obj.email
    },
    avatarUrl: {
      type: GraphQLString,
      resolve: (obj) => obj.profile_image_url_small
    }
  }
});

export const {
  nodeType: GraphQLCreditRecord,
  connectionType: GraphQLCreditRecordConnection,
  edgeType: GraphQLCreditRecordEdge
} = creditRecordQuery(nodeInterface, {GraphQLUserRef});

export const {
  nodeType: GraphQLOrderStatus,
  connectionType: GraphQLStatusConnection,
  edgeType: GraphQLStatusEdge
} = orderStatusQuery(nodeInterface);

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
  nodeType: GraphQLCategory,
  connectionType: GraphQLCategoryConnection,
  edgeType: GraphQLCategoryEdge
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
  nodeType: GraphQLAssignedVoucher,
  connectionType: GraphQLAssignedVoucherConnection,
  edgeType: GraphQLAssignedVoucherEdge
} = assignedVoucherQuery(nodeInterface, {GraphQLVoucher});

export const {
  nodeType: GraphQLOrderItem,
  connectionType: GraphQLOrderItemConnection,
  edgeType: GraphQLOrderItemEdge
} = orderItemQuery(nodeInterface, {GraphQLCloth});

export const {
  nodeType: GraphQLOrder,
  connectionType: GraphQLOrderConnection,
  edgeType: GraphQLOrderEdge
} = orderQuery(nodeInterface, {
  GraphQLOrderItemConnection,
  GraphQLOrderStatus
});

export const {
  nodeType: GraphQLUser,
  connectionType: GraphQLUserConnection,
  edgeType: GraphQLUserEdge
} = userQuery(nodeInterface, {
  GraphQLAddressConnection,
  GraphQLAssignedVoucherConnection,
  GraphQLTransactionConnection,
  GraphQLCreditRecordConnection,
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
  GraphQLVoucher,
  GraphQLOrderStatus,
  GraphQLUserConnection,
  GraphQLWorkerConnection,
  GraphQLAdminConnection,
  GraphQLOrderConnection,
  GraphQLTransactionConnection,
  GraphQLClothConnection,
  GraphQLCategoryConnection,
  GraphQLTimeSlotTemplateConnection,
  GraphQLTimeSlotConnection,
  GraphQLFactoryConnection,
  GraphQLPromoCodeConnection,
  GraphQLVoucherConnection,
  GraphQLBannerConnection,
  GraphQLFeedbackConnection,
  GraphQLCreditRecordConnection
});

export const {
  nodeType: GraphQLLoginUser
} = loginUserQuery(nodeInterface, {
  GraphQLBanner,
  GraphQLCloth,
  GraphQLCategory,
  GraphQLOrderConnection,
  GraphQLCreditRecordConnection,
  GraphQLAssignedVoucherConnection
});

export const {
  nodeType: GraphQLApp
} = appQuery(nodeInterface, {
  GraphQLLoginUser
});

export default new GraphQLObjectType({
  name: 'Query',
  description: 'Query root',
  fields: {
    viewer: {
      type: GraphQLViewer,
      resolve: () => new Viewer()
    },
    app: {
      type: GraphQLApp,
      resolve: () => new App()
    },
    node: nodeField
  }
});

