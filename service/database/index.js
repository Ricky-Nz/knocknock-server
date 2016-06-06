import Sequelize from 'sequelize';
import config from '../config';

const db = config.rds;

const sequelize = new Sequelize(db.test, db.username, db.password, {
  host: db.host,
  dialect: db.type,
  pool: db.pool
});

export const DBAdmins = sequelize.define('admins');
export const DBAdminsRoles = sequelize.define('admins_roles');
export const DBBlockedDates = sequelize.define('blocked_dates');
export const DBBlockedTimes = sequelize.define('blocked_times');
export const DBCategories = sequelize.define('categories');
export const DBDefaultDistrictTimeslots = sequelize.define('default_district_timeslots');
export const DBDistrictSettings = sequelize.define('district_settings');
export const DBDistrictTimeslots = sequelize.define('district_timeslots');
export const DBDistrictWorkers = sequelize.define('district_workers');
export const DBDistricts = sequelize.define('districts');
export const DBFactories = sequelize.define('factories');
export const DBInvalidDateTimes = sequelize.define('invalid_date_times');
export const DBInvalidDates = sequelize.define('invalid_dates');
export const DBInvalidTimes = sequelize.define('invalid_times');
export const DBItems = sequelize.define('items');
export const DBLaundryTypes = sequelize.define('laundry_types');
export const DBOauthAccessGrants = sequelize.define('oauth_access_grants');
export const DBOauthAccessTokens = sequelize.define('oauth_access_tokens');
export const DBOauthApplications = sequelize.define('oauth_applications');
export const DBOrderDetails = sequelize.define('order_details');
export const DBOrderHistories = sequelize.define('order_histories');
export const DBOrderImages = sequelize.define('order_images');
export const DBSlots = sequelize.define('order_slots');
export const DBOrderSources = sequelize.define('order_sources');
export const DBOrderStatues = sequelize.define('order_statuses');
export const DBOrderTimes = sequelize.define('order_times');
export const DBOrderTransactions = sequelize.define('order_transactions');
export const DBOrders = sequelize.define('orders');
export const DBPermissions = sequelize.define('permissions');
export const DBPermissionsRoles = sequelize.define('permissions_roles');
export const DBPromoCodes = sequelize.define('promo_codes');
export const DBPromos = sequelize.define('promos');
export const DBPromotionBanners = sequelize.define('promotion_banners');
export const DBPromotions = sequelize.define('promotions');
export const DBRanks = sequelize.define('ranks');
export const DBRecurringOrders = sequelize.define('recurring_orders');
export const DBRoles = sequelize.define('roles');
export const DBSchemaMigrations = sequelize.define('schema_migrations');
export const DBSmsTemplates = sequelize.define('sms_templates');
export const DBSpatialRefSys = sequelize.define('spatial_ref_sys');
export const DBSubCategories = sequelize.define('sub_categories');
export const DBSupportCases = sequelize.define('support_cases');
export const DBSupportCategories = sequelize.define('support_categories');
export const DBTextContents = sequelize.define('text_contents');
export const DBUserAddresses = sequelize.define('user_addresses');
export const DBUserCreditCards = sequelize.define('user_credit_cards');
export const DBUserCreditTransactions = sequelize.define('user_credit_transactions');
export const DBUserCredits = sequelize.define('user_credits');
export const DBUserFeedbacks = sequelize.define('user_feedbacks');
export const DBUserPromos = sequelize.define('user_promos');
export const DBUserReferralCodes = sequelize.define('user_referral_codes');
export const DBUsers = sequelize.define('users');
export const DBVouchers = sequelize.define('vouchers');
export const DBWorkerRoles = sequelize.define('worker_roles');
export const DBWorkers = sequelize.define('workers');

