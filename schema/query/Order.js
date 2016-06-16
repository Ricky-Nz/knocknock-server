import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, connectionArgs, toGlobalId } from 'graphql-relay';
import { Users, OrderStatuses, OrderDetails, PromoCodes, Vouchers, UserVouchers } from '../../service/database';
import { modelConnection, toDisplayDate } from '../utils';

   // { id: 826,
   //   pickup_worker_id: 11,
   //   drop_off_worker_id: 8,
   //   user_id: 798,
   //   order_status_id: 7,
   //   drop_off_district_id: 57,
   //   pickup_district_id: 57,
   //   factory_id: null,
   //   description: '',
   //   lazy_order: false,
   //   express_order: false,
   //   total_price: '10.90',
   //   pickup_address: '104B Edgefield Plains 04-35',
   //   pickup_postal_code: '822104',
   //   pickup_apartment_type: 'hdb',
   //   drop_off_address: '104B Edgefield Plains 04-35',
   //   drop_off_postal_code: '822104',
   //   drop_off_apartment_type: 'hdb',
   //   speed_rating: null,
   //   attitude_rating: null,
   //   created_on: Fri Sep 25 2015 17:33:23 GMT+0800 (SGT),
   //   pickup_date: Mon Sep 28 2015 09:00:00 GMT+0800 (SGT),
   //   pickup_time: '09:00:00',
   //   drop_off_date: Tue Oct 06 2015 13:00:00 GMT+0800 (SGT),
   //   drop_off_time: '13:00:00',
   //   review: null,
   //   pickup_changed: false,
   //   deliver_changed: false,
   //   paypal_ref_no: null,
   //   paid: true,
   //   pay_later: null,
   //   payment_mode: 'credit',
   //   to_pay_price: '10.90',
   //   voucher_id: null,
   //   free: null,
   //   worker_checked: true,
   //   user_checked: false,
   //   order_source_id: 0,
   //   qr_code_url: null,
   //   factory_worker_id: null,
   //   factory_received_date: null,
   //   factory_completed_date: null,
   //   is_merged: false,
   //   signature_url: null,
   //   merged_order_ids: null,
   //   is_imported: null,
   //   is_mergable: null,
   //   order_number: null,
   //   pickup_contact_no: null,
   //   drop_off_contact_no: null,
   //   recurring_order_id: null,
   //   promo_code_id: null,
   //   promo_discount: null,
   //   voucher_discount: null,
   //   pickup_time_end: '11:00:00',
   //   drop_off_time_end: '15:00:00',
   //   pickup_unit_number: null,
   //   drop_off_unit_number: null,
   //   drop_off_description: null,
   //   pickup_address_name: null,
   //   drop_off_address_name: null },

export default function (nodeInterface, {
  GraphQLOrderItemConnection,
  GraphQLOrderStatus,
  GraphQLPromoCode,
  GraphQLVoucher
}) {
  const nodeType = new GraphQLObjectType({
    name: 'Order',
    fields: {
      id: globalIdField('Order'),
      displayId: {
        type: GraphQLInt,
        resolve: (obj) => obj.id
      },
      userId: {
        type: GraphQLString,
        resolve: (obj) => toGlobalId('User', obj.user_id)
      },
      express: {
        type: GraphQLBoolean,
        resolve: (obj) => obj.express_order
      },
      paid: {
        type: GraphQLBoolean,
        resolve: (obj) => obj.paid
      },
      paymentMode: {
        type: GraphQLString,
        resolve: (obj) => obj.payment_mode
      },
      promoCode: {
        type: GraphQLPromoCode,
        resolve: (obj) => obj.promo_code_id?PromoCodes.findById(obj.promo_code_id):null
      },
      voucher: {
        type: GraphQLVoucher,
        resolve: (obj) => obj.voucher_id?Vouchers.findById(obj.voucher_id):null
      },
      note: {
        type: GraphQLString,
        resolve: (obj) => obj.description
      },
      status: {
        type: GraphQLOrderStatus,
        resolve: (obj) => OrderStatuses.findById(obj.order_status_id)
      },
      pickupDate: {
        type: GraphQLString,
        resolve: (obj) => obj.pickup_date
      },
      displayPickupDate: {
        type: GraphQLString,
        resolve: (obj) => `${toDisplayDate(obj.pickup_date)} ${obj.pickup_time}`
      },
      displayDropOffDate: {
        type: GraphQLString,
        resolve: (obj) => `${toDisplayDate(obj.drop_off_date)} ${obj.drop_off_time}`
      },
      pickupTime: {
        type: GraphQLString,
        resolve: (obj) => obj.pickup_time
      },
      pickupContact: {
        type: GraphQLString,
        resolve: (obj) => obj.pickup_contact_no
      },
      dropOffContact: {
        type: GraphQLString,
        resolve: (obj) => obj.drop_off_contact_no
      },
      displayPickupAddress: {
        type: GraphQLString,
        resolve: (obj) => `${obj.pickup_address||''}, ${obj.pickup_unit_number||''} ${obj.pickup_postal_code||''}`
      },
      displayDropOffAddress: {
        type: GraphQLString,
        resolve: (obj) => `${obj.drop_off_address||''}, ${obj.drop_off_unit_number||''} ${obj.drop_off_postal_code||''}`
      },
      pickupAddress: {
        type: GraphQLString,
        resolve: (obj) => obj.pickup_address
      },
      pickupWorkerId: {
        type: GraphQLString,
        resolve: (obj) => toGlobalId('Worker', obj.pickup_worker_id)
      },
      factoryId: {
        type: GraphQLString,
        resolve: (obj) => toGlobalId('Factory', obj.factory_id)
      },
      totalPrice: {
        type: GraphQLFloat,
        resolve: (obj) => obj.total_price
      },
      toPayPrice: {
        type: GraphQLFloat,
        resolve: (obj) => obj.to_pay_price
      },
      userAvatar: {
        type: GraphQLString,
        resolve: (obj) => Users.findById(obj.user_id).then(user => user.profile_image_url_small)
      },
      orderItems: {
        type: GraphQLOrderItemConnection,
        args: {
          ...connectionArgs
        },
        resolve: (obj, args) =>
          modelConnection(OrderDetails, {where:{order_id: obj.id}}, args)
      }
    },
    interfaces: [nodeInterface]
  });

  return {
    nodeType,
    ...connectionDefinitions({nodeType})
  };
}

