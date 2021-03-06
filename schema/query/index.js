import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLInputObjectType } from 'graphql';
import { nodeDefinitions, fromGlobalId, toGlobalId } from 'graphql-relay';
import { Users, Admins, Workers, UserAddresses, Items, SubCategories,
  Vouchers, Orders, OrderDetails, OrderTransactions,
  Factories, PromoCodes, PromotionBanners, UserFeedbacks, OrderStatuses,
  UserCredits, UserVouchers, UserCreditCards } from '../../service/database';
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
import userQuery from './User';
import viewerQuery from './Viewer';
import voucherQuery from './Voucher';
import assignedVoucherQuery from './AssignedVoucher';
import workerQuery from './Worker';
import orderStatusQuery from './OrderStatus';
import creditRecordQuery from './CreditRecord';
import loginUserQuery from './LoginUser';
import creditCardQuery from './CreditCard';

class Viewer {}
class LoginUser {}

export const getTimeSlots = function(date) {
  const target = new Date(date);
  const now = new Date();
  let hour = 0;
  if ((target.getFullYear() === now.getFullYear())
    && (target.getMonth() === now.getMonth())
    && (target.getDate() === now.getDate())) {
    hour = now.getHours() + 1;
  }

  return [
    new TimeSlot(0, '9:00 ~ 11:00', 9, hour < 11),
    new TimeSlot(1, '11:00 ~ 13:00', 11, hour < 13),
    new TimeSlot(2, '13:00 ~ 15:00', 13, hour < 15),
    new TimeSlot(3, '15:00 ~ 17:00', 15, hour < 17),
    new TimeSlot(4, '17:00 ~ 19:00', 17, hour < 19),
    new TimeSlot(5, '19:00 ~ 21:00', 19, hour < 21)
  ];
}

export class TimeSlot {
  constructor(id, displayTime, hour, enabled){
    this.id = id;
    this.displayTime = displayTime;
    this.hour = hour;
    this.enabled = enabled;
  }
}

export const GraphQLOrderItemInput = new GraphQLInputObjectType({
  name: 'OrderItemInput',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    wash: {
      type: GraphQLInt
    },
    dry: {
      type: GraphQLInt
    },
    iron: {
      type: GraphQLInt
    }
  }
});

function buildLoginUserObject(userId) {
  return Users.findById(userId)
    .then(user => {
      let loginUser = new LoginUser();
      for (const key in user.dataValues) {
        loginUser[key] = user[key];
      }
      return loginUser;
    });
}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'Viewer') {
      return new Viewer();
    } else if (type === 'LoginUser') {
      return buildLoginUserObject(id);
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
      return UserVouchers.findById(id);
    } else if (type === 'Order') {
      return Orders.findById(id);
    } else if (type === 'OrderItem') {
      return OrderDetails.findById(id);
    } else if (type === 'TimeSlot') {
      return getTimeSlots()[id];
    } else if (type === 'Factory') {
      return Factories.findById(id);
    } else if (type === 'PromoCode') {
      return PromoCodes.findById(id);
    } else if (type === 'Banner') {
      return PromotionBanners.findById(id);
    } else if (type === 'Feedback') {
      return UserFeedbacks.findById(id);
    } else if (type === 'OrderStatus') {
      return OrderStatuses.findById(id);
    } else if (type === 'CreditRecord') {
      return UserCredits.findById(id);
    } else if (type === 'CreditCard') {
      return UserCreditCards.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
  	if (obj instanceof Viewer) {
    	return GraphQLViewer;
    } else if (obj instanceof LoginUser) {
      return GraphQLLoginUser;
    } else if (obj instanceof Users.Instance) {
  		return GraphQLUser;
  	} else if (obj instanceof Admins.Instance) {
      return GraphQLAdmin;
    } else if (obj instanceof Workers.Instance) {
      return GraphQLWorker;
    } else if (obj instanceof UserAddresses.Instance) {
      return GraphQLAddress;
    } else if (obj instanceof Items.Instance) {
      return GraphQLCloth;
    } else if (obj instanceof SubCategories.Instance) {
      return GraphQLClothCategory;
    } else if (obj instanceof Vouchers.Instance) {
      return GraphQLVoucher;
    } else if (obj instanceof UserVouchers.Instance) {
      return GraphQLAssignedVoucher;
    } else if (obj instanceof Orders.Instance) {
      return GraphQLOrder;
    } else if (obj instanceof OrderDetails.Instance) {
      return GraphQLOrderItem;
    } else if (obj instanceof TimeSlot) {
      return GraphQLTimeSlot;
    } else if (obj instanceof Factories.Instance) {
      return GraphQLFactory;
    } else if (obj instanceof PromoCodes.Instance) {
      return GraphQLPromoCode;
    } else if (obj instanceof PromotionBanners.Instance) {
      return GraphQLBanner;
    } else if (obj instanceof UserFeedbacks.Instance) {
      return GraphQLFeedback;
    } else if (obj instanceof OrderStatuses.Instance) {
      return GraphQLOrderStatus;
    } else if (obj instanceof UserCredits.Instance) {
      return GraphQLCreditRecord;
    } else if (obj instanceof UserCreditCards.Instance) {
      return GraphQLCreditCard;
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
  nodeType: GraphQLCreditCard,
  connectionType: GraphQLCreditCardConnection,
  edgeType: GraphQLCreditCardEdge
} = creditCardQuery(nodeInterface);

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
  nodeType: GraphQLTimeSlot,
  connectionType: GraphQLTimeSlotConnection,
  edgeType: GraphQLTimeSlotEdge
} = timeSlotQuery(nodeInterface);

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
  GraphQLVoucher,
  GraphQLOrderStatus,
  GraphQLPromoCode
});

export const {
  nodeType: GraphQLUser,
  connectionType: GraphQLUserConnection,
  edgeType: GraphQLUserEdge
} = userQuery(nodeInterface, {
  GraphQLAddressConnection,
  GraphQLAssignedVoucherConnection,
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
  GraphQLClothConnection,
  GraphQLCategoryConnection,
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
  getTimeSlots,
  GraphQLBanner,
  GraphQLCloth,
  GraphQLOrder,
  GraphQLAddress,
  GraphQLPromoCode,
  GraphQLCategory,
  GraphQLTimeSlot,
  GraphQLAssignedVoucher,
  GraphQLOrderConnection,
  GraphQLAddressConnection,
  GraphQLCreditCardConnection,
  GraphQLCreditRecordConnection,
  GraphQLAssignedVoucherConnection
});

export const appRootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: GraphQLLoginUser,
      resolve: (obj, args, {userId}) => buildLoginUserObject(userId)
    },
    node: nodeField
  }
});

export const backendRootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: GraphQLViewer,
      resolve: () => new Viewer()
    },
    node: nodeField
  }
});

