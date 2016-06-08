import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, connectionArgs } from 'graphql-relay';
import { DBUsers, DBOrderStatuses, DBOrderDetails } from '../../service/database';
import { modelConnection } from '../utils';

// id      
// pickup_worker_id      
// drop_off_worker_id      
// user_id     
// order_status_id     
// drop_off_district_id      
// pickup_district_id      
// factory_id      
// description     
// lazy_order      
// express_order     
// total_price     
// pickup_address      
// pickup_postal_code      
// pickup_apartment_type     
// drop_off_address      
// drop_off_postal_code      
// drop_off_apartment_type     
// speed_rating      
// attitude_rating     
// created_on      
// pickup_date     
// pickup_time     
// drop_off_date     
// drop_off_time     
// review      
// pickup_changed      
// deliver_changed     
// paypal_ref_no     
// paid      
// pay_later     
// payment_mode      
// to_pay_price      
// voucher_id      
// free      
// worker_checked      
// user_checked      
// order_source_id     
// qr_code_url     
// factory_worker_id     
// factory_received_date     
// factory_completed_date      
// is_merged     
// signature_url     
// merged_order_ids      
// is_imported     
// is_mergable     
// order_number      
// pickup_contact_no     
// drop_off_contact_no     
// recurring_order_id      
// promo_code_id     
// promo_discount      
// voucher_discount      
// pickup_time_end     
// drop_off_time_end     
// pickup_unit_number      
// drop_off_unit_number      
// drop_off_description      
// pickup_address_name     
// drop_off_address_name

export default function (nodeInterface, {GraphQLOrderItemConnection}) {
  const nodeType = new GraphQLObjectType({
    name: 'Order',
    fields: {
      id: globalIdField('Order'),
      userId: {
        type: GraphQLString,
        resolve: (obj) => obj.user_id
      },
      express: {
        type: GraphQLBoolean,
        resolve: (obj) => obj.express_order
      },
      note: {
        type: GraphQLString,
        resolve: (obj) => obj.description
      },
      status: {
        type: GraphQLString,
        resolve: (obj) => DBOrderStatuses.findById(obj.order_status_id)
          .then(status => status.status)
      },
      pickupDate: {
        type: GraphQLString,
        resolve: (obj) => obj.pickup_date
      },
      pickupTime: {
        type: GraphQLString,
        resolve: (obj) => obj.pickup_time
      },
      pickupAddress: {
        type: GraphQLString,
        resolve: (obj) => obj.pickup_address
      },
      pickupWorkerId: {
        type: GraphQLString,
        resolve: (obj) => obj.pickup_worker_id
      },
      serialNumber: {
        type: GraphQLString,
        resolve: (obj) => obj.order_number
      },
      totalPrice: {
        type: GraphQLInt,
        resolve: (obj) => obj.total_price
      },
      userAvatar: {
        type: GraphQLString,
        resolve: (obj) =>
          DBUsers.findById(obj.user_id).then(user => user.profile_image_url_small)
      },
      orderItems: {
        type: GraphQLOrderItemConnection,
        args: {
          ...connectionArgs
        },
        resolve: (obj, args) =>
          modelConnection(DBOrderDetails, {where:{order_id: obj.id}}, args)
      }
    },
    interfaces: [nodeInterface]
  });

  return {
    nodeType,
    ...connectionDefinitions({nodeType})
  };
}

