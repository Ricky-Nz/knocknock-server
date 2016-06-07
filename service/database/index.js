import Sequelize from 'sequelize';
import config from '../../config';

const db = config.rds;

const sequelize = new Sequelize(db.test, db.username, db.password, {
  host: db.host,
  dialect: db.type,
  pool: db.pool
});

const modelConfig = {timestamps: false};

export const DBAdmins = sequelize.define('admins', {}, modelConfig);
export const DBAdminsRoles = sequelize.define('admins_roles', {}, modelConfig);
export const DBBlockedDates = sequelize.define('blocked_dates', {}, modelConfig);
export const DBBlockedTimes = sequelize.define('blocked_times', {}, modelConfig);
export const DBCategories = sequelize.define('categories', {}, modelConfig);
export const DBDefaultDistrictTimeslots = sequelize.define('default_district_timeslots', {}, modelConfig);
export const DBDistrictSettings = sequelize.define('district_settings', {}, modelConfig);
export const DBDistrictTimeslots = sequelize.define('district_timeslots', {}, modelConfig);
export const DBDistrictWorkers = sequelize.define('district_workers', {}, modelConfig);
export const DBDistricts = sequelize.define('districts', {}, modelConfig);
export const DBFactories = sequelize.define('factories', {}, modelConfig);
export const DBInvalidDateTimes = sequelize.define('invalid_date_times', {}, modelConfig);
export const DBInvalidDates = sequelize.define('invalid_dates', {}, modelConfig);
export const DBInvalidTimes = sequelize.define('invalid_times', {}, modelConfig);
export const DBItems = sequelize.define('items', {}, modelConfig);
export const DBLaundryTypes = sequelize.define('laundry_types', {}, modelConfig);
export const DBOauthAccessGrants = sequelize.define('oauth_access_grants', {}, modelConfig);
export const DBOauthAccessTokens = sequelize.define('oauth_access_tokens', {}, modelConfig);
export const DBOauthApplications = sequelize.define('oauth_applications', {}, modelConfig);
export const DBOrderDetails = sequelize.define('order_details', {}, modelConfig);
export const DBOrderHistories = sequelize.define('order_histories', {}, modelConfig);
export const DBOrderImages = sequelize.define('order_images', {}, modelConfig);
export const DBSlots = sequelize.define('order_slots', {}, modelConfig);
export const DBOrderSources = sequelize.define('order_sources', {}, modelConfig);
export const DBOrderStatuses = sequelize.define('order_statuses', {}, modelConfig);
export const DBOrderTimes = sequelize.define('order_times', {}, modelConfig);
export const DBOrderTransactions = sequelize.define('order_transactions', {}, modelConfig);
export const DBOrders = sequelize.define('orders', {}, modelConfig);
export const DBPermissions = sequelize.define('permissions', {}, modelConfig);
export const DBPermissionsRoles = sequelize.define('permissions_roles', {}, modelConfig);
export const DBPromoCodes = sequelize.define('promo_codes', {}, modelConfig);
export const DBPromos = sequelize.define('promos', {}, modelConfig);
export const DBPromotionBanners = sequelize.define('promotion_banners', {}, modelConfig);
export const DBPromotions = sequelize.define('promotions', {}, modelConfig);
export const DBRanks = sequelize.define('ranks', {}, modelConfig);
export const DBRecurringOrders = sequelize.define('recurring_orders', {}, modelConfig);
export const DBRoles = sequelize.define('roles', {}, modelConfig);
export const DBSchemaMigrations = sequelize.define('schema_migrations', {}, modelConfig);
export const DBSmsTemplates = sequelize.define('sms_templates', {}, modelConfig);
export const DBSpatialRefSys = sequelize.define('spatial_ref_sys', {}, modelConfig);
export const DBSubCategories = sequelize.define('sub_categories', {}, modelConfig);
export const DBSupportCases = sequelize.define('support_cases', {}, modelConfig);
export const DBSupportCategories = sequelize.define('support_categories', {}, modelConfig);
export const DBTextContents = sequelize.define('text_contents', {}, modelConfig);
export const DBUserAddresses = sequelize.define('user_addresses', {}, modelConfig);
export const DBUserCreditCards = sequelize.define('user_credit_cards', {}, modelConfig);
export const DBUserCreditTransactions = sequelize.define('user_credit_transactions', {}, modelConfig);
export const DBUserCredits = sequelize.define('user_credits', {}, modelConfig);
export const DBUserFeedbacks = sequelize.define('user_feedbacks', {}, modelConfig);
export const DBUserPromos = sequelize.define('user_promos', {}, modelConfig);
export const DBUserReferralCodes = sequelize.define('user_referral_codes', {}, modelConfig);
export const DBUsers = sequelize.define('users', {}, modelConfig);
export const DBVouchers = sequelize.define('vouchers', {}, modelConfig);
export const DBWorkerRoles = sequelize.define('worker_roles', {}, modelConfig);
export const DBWorkers = sequelize.define('workers', {}, modelConfig);

