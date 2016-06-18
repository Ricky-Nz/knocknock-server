import { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionDefinitions, globalIdField, connectionArgs, fromGlobalId, toGlobalId } from 'graphql-relay';
import { PromotionBanners, Users, Orders, UserCredits, UserAddresses, UserCreditCards, UserVouchers,
  SubCategories, Items, BlockedDates, BlockedTimes, OrderSlots } from '../../service/database';
import { modelConnection, verifyPassword, indentDate, formatTime } from '../utils';
import { getAddressByPostalCode } from '../../service/location';

  // { id: 3812,
  //   first_name: 'li fan',
  //   last_name: 'Lin',
  //   contact_no: '91089509',
  //   credit: '0.00',
  //   points: 0,
  //   profile_image_url_small: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/users/default_small.jpg',
  //   profile_image_url_medium: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/users/default_medium.jpg',
  //   profile_image_url_big: 'https://s3-ap-southeast-1.amazonaws.com/knocknock/users/default_big.jpg',
  //   gender: 'female',
  //   code: 'uiR7SY',
  //   age: null,
  //   marital_status: null,
  //   have_child: null,
  //   have_maid: null,
  //   occupation: null,
  //   nationality: null,
  //   orders_count: 1,
  //   rank: null,
  //   disabled: false,
  //   first_login: true,
  //   created_on: Sun Feb 28 2016 11:33:25 GMT+0800 (SGT),
  //   email: '',
  //   encrypted_password: '$2a$10$TDlCJa2LVuhhzjtqsEkVi.NPl6XhF1.CjTINI2EQrVnomPHSkYlne',
  //   reset_password_token: null,
  //   reset_password_sent_at: null,
  //   is_imported: true,
  //   created_by: 'admin',
  //   verification_code: null,
  //   is_verified: true,
  //   birth_month: null,
  //   birth_year: null,
  //   adv_source: null,
  //   referral_code: 'yuGCvoV5',
  //   verification_code_expiry: null,
  //   stripe_customer_id: null,
  //   android_app_version: null,
  //   ios_app_version: null,
  //   plus_account: null },

export default function (nodeInterface, {
	GraphQLBanner,
	GraphQLCloth,
  GraphQLOrder,
	GraphQLCategory,
  GraphQLTimeSlot,
  GraphQLAddressConnection,
	GraphQLOrderConnection,
	GraphQLCreditCardConnection,
	GraphQLCreditRecordConnection,
	GraphQLAssignedVoucherConnection
}) {
	const nodeType = new GraphQLObjectType({
		name: 'LoginUser',
		fields: {
			id: globalIdField('LoginUser'),
	  	orders: {
	  		type: GraphQLOrderConnection,
	  		args: {
	  			...connectionArgs
	  		},
	  		resolve: (user, args) =>
	  			modelConnection(Orders, {where:{$and:{
	  				order_status_id:{$notIn:[8, 9]},
	  				user_id: user.id
	  			}}, order: 'id DESC'}, args)
	  	},
	  	histories: {
	  		type: GraphQLOrderConnection,
	  		args: {
	  			...connectionArgs
	  		},
	  		resolve: (user, args) =>
	  			modelConnection(Orders, {where:{$and:{
	  				order_status_id:{$in:[8, 9]},
	  				user_id: user.id
	  			}}, order: 'id DESC'}, args)
	  	},
	  	toPayOrders: {
	  		type: GraphQLOrderConnection,
	  		args: {
	  			...connectionArgs
	  		},
	  		resolve: (user, args) =>
	  			modelConnection(Orders, {where:{$and:{
	      		paid:false,
	      		user_id: user.id
	  			}}, order: 'id DESC'}, args)
	  	},
      banners: {
        type: new GraphQLList(GraphQLBanner),
        resolve: (user) =>
        	PromotionBanners.findAll({where:{is_enabled:true}, order: 'banner_order', limit: 5})
      },
      categories: {
        type: new GraphQLList(GraphQLCategory),
        resolve: (user) => SubCategories.findAll({order: 'item_order'})
      },
      clothes: {
      	type: new GraphQLList(GraphQLCloth),
      	args: {
          search: {
            type: GraphQLString
          },
      		categoryId: {
      			type: GraphQLString
      		},
          clothIds: {
            type: new GraphQLList(GraphQLString)
          }
      	},
      	resolve: (user, {search, categoryId, clothIds}) => {
          if (search) {
            return Items.findAll({where:{$or:{
              name_en: {$like: `%${search}%`},
              name_ch: {$like: `%${search}%`}
            }}, order: 'item_order', limit: 10});
          } else if (categoryId) {
            const {id: localId} = fromGlobalId(categoryId);
            return Items.findAll({where:{$and:{
                disabled: false,
                hide_from_user: false,
                sub_category_id: localId
              }}, order: 'item_order'});
          } else if (clothIds) {
            const localIds = clothIds.map(id => {
              const {id: localId} = fromGlobalId(id);
              return localId;
            });
            return Items.findAll({where:{id:{$in:localIds}}, order: 'item_order'});
          } else {
            return null;
          }
      	}
      },
      creditRecords: {
        type: GraphQLCreditRecordConnection,
        args: {
          ...connectionArgs
        },
        resolve: (user, args) =>
          modelConnection(UserCredits, {where:{user_id: user.id}, order: 'created_on DESC'}, args)
      },
      creditCards: {
      	type: GraphQLCreditCardConnection,
      	args: {
      		...connectionArgs
      	},
      	resolve: (user, args) =>
      		modelConnection(UserCreditCards, {where:{user_id: user.id}, order: 'id DESC'}, args)
      },
      vouchers: {
        type: GraphQLAssignedVoucherConnection,
        args: {
          ...connectionArgs
        },
        resolve: (user, {all, search, ...args}) =>
          modelConnection(UserVouchers, {where:{user_id: user.id}, order: 'created_on DESC'}, args)
      },
      addresses: {
        type: GraphQLAddressConnection,
        args: {
          ...connectionArgs
        },
        resolve: (user, args) =>
          modelConnection(UserAddresses, {where:{user_id: user.id}, order: 'created_on DESC'}, args)
      },
      toPayCount: {
      	type: new GraphQLNonNull(GraphQLInt),
      	resolve: (user) => Orders.count({where:{$and:{
	      		paid:false,
	      		user_id: user.id
	      	}}})
      },
      voucherCount: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: (user) =>
          UserVouchers.count({where:{$and:{
            user_id: user.id,
            used: false
          }}})
      },
      pickupBlockDates: {
        type: new GraphQLList(GraphQLString),
        args: {
          year: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          month: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve: (user, {year, month}) =>
          BlockedDates.findAll({where:{$and:{
            is_pickup: true,
            block_fullday: true,
            date: {$like:`${year}-${indentDate(month)}%`}
          }}, attributes:['date', 'id']}).then(dates => dates.map(date => `${date.date}$${date.id}`))
      },
      pickupTimes: {
        type: new GraphQLList(GraphQLString),
        args: {
          dateId: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (user, {dateId}) =>
          BlockedTimes.findAll({where:{$and:{
            blocked_date_id: dateId
          }}, attributes:['start_time', 'end_time', 'blocked_fullday']})
            .then(dates => dates.map(time => `${time.start_time}$${time.end_time}$${time.blocked_fullday}`))
      },
      credits: {
      	type: GraphQLString,
      	resolve: (user) => `$${user.credit}`
      },
      firstName: {
        type: GraphQLString,
        resolve: (user) => user.first_name
      },
      lastName: {
        type: GraphQLString,
        resolve: (user) => user.last_name
      },
      email: {
        type: GraphQLString,
        resolve: (user) => user.email
      },
      contact: {
        type: GraphQLString,
        resolve: (user) => user.contact_no
      },
      plusAccount: {
        type: GraphQLString,
        resolve: (user) => user.plus_account
      },
      avatarUrl: {
        type: GraphQLString,
        resolve: (user) => user.profile_image_url_small
      },
      order: {
        type: GraphQLOrder,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (user, {id}) => {
          const {id: localId} = fromGlobalId(id);
          return Orders.findOne({where:{$and:{
              user_id: user.id,
              id: localId
            }}});
        }
      },
      address: {
        type: GraphQLString,
        args: {
          postalCode: {
            type: GraphQLString
          }
        },
        resolve: (obj, {postalCode}) => postalCode?getAddressByPostalCode(postalCode):null
      },
      timeSlots: {
        type: new GraphQLList(GraphQLTimeSlot),
        args: {
          date: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (obj, {date}) => {
          date = formatTime(date, 8);
          return OrderSlots.findAll({where:{date}});
        }
      }
		},
		interfaces: [nodeInterface]
	});

	return {
		nodeType,
		...connectionDefinitions({nodeType})
	};
}