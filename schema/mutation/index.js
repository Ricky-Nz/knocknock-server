import { GraphQLObjectType } from 'graphql';
import AddressMutation from './AddressMutation';
import AdminMutation from './AdminMutation';
import BannerMutation from './BannerMutation';
import CategoryMutation from './CategoryMutation';
import ClothMutation from './ClothMutation';
import FactoryMutation from './FactoryMutation';
import FeedbackMutation from './FeedbackMutation';
import OrderMutation from './OrderMutation';
import PromoCodeMutation from './PromoCodeMutation';
import TimeSlotMutation from './TimeSlotMutation';
import TimeSlotTemplateMutation from './TimeSlotTemplateMutation';
import UserMutation from './UserMutation';
import VoucherMutation from './VoucherMutation';
import WorkerMutation from './WorkerMutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...AddressMutation,
    ...AdminMutation,
    ...BannerMutation,
    ...CategoryMutation,
    ...ClothMutation,
    ...FactoryMutation,
    ...FeedbackMutation,
    ...OrderMutation,
    ...PromoCodeMutation,
    ...TimeSlotMutation,
    ...TimeSlotTemplateMutation,
    ...UserMutation,
    ...VoucherMutation,
    ...WorkerMutation
  }
});