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
import createTimeSlot from './TimeSlotCreate';
import updateTimeSlot from './TimeSlotUpdate';
import deleteTimeSlot from './TimeSlotDelete';
import createFactory from './FactoryCreate';
import updateFactory from './FactoryUpdate';
import deleteFactory from './FactoryDelete';

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
    createTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    createFactory,
    updateFactory,
    deleteFactory,
    bulkUpdateOrder
  }
});