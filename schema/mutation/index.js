import { GraphQLObjectType } from 'graphql';
import createCloth from './ClothCreate';
import updateCloth from './ClothUpdate';
import deleteCloth from './ClothDelete';
import createCategory from './CategoryCreate';
import updateCategory from './CategoryUpdate';
import deleteCategory from './CategoryDelete';
import createUser from './UserCreate';
import updateUser from './UserUpdate';
import createWorker from './WorkerCreate';
import updateWorker from './WorkerUpdate';
import createAdmin from './AdminCreate';
import updateAdmin from './AdminUpdate';
import createAddress from './AddressCreate';
import updateAddress from './AddressUpdate';
import deleteAddress from './AddressDelete';
import createVoucher from './VoucherCreate';
import createOrder from './OrderCreate';
import updateOrder from './OrderUpdate';
import bulkUpdateOrder from './OrderBulkUpdate';
import createTimeSlotTemplate from './TimeSlotTemplateCreate';
import updateTimeSlotTemplate from './TimeSlotTemplateUpdate';
import deleteTimeSlotTemplate from './TimeSlotTemplateDelete';
import updateTimeSlot from './TimeSlotUpdate';
import createFactory from './FactoryCreate';
import updateFactory from './FactoryUpdate';
import deleteFactory from './FactoryDelete';
import createPromoCode from './PromoCodeCreate';
import updatePromoCode from './PromoCodeUpdate';
import deletePromoCode from './PromoCodeDelete';
import createFeedback from './FeedbackCreate';
import createBanner from './BannerCreate';
import updateBanner from './BannerUpdate';
import deleteBanner from './BannerDelete';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  	createCloth,
  	updateCloth,
  	deleteCloth,
  	createCategory,
  	updateCategory,
  	deleteCategory,
  	createUser,
    updateUser,
    createWorker,
    updateWorker,
    createAdmin,
    updateAdmin,
    createAddress,
    updateAddress,
    deleteAddress,
    createVoucher,
    createOrder,
    updateOrder,
    createTimeSlotTemplate,
    updateTimeSlotTemplate,
    deleteTimeSlotTemplate,
    updateTimeSlot,
    createFactory,
    updateFactory,
    deleteFactory,
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    createFeedback,
    createBanner,
    updateBanner,
    deleteBanner
  }
});