import { PromoCodes } from '../service/database';

PromoCodes.findAll()
	.then(address => console.log(address.map(({dataValues}) => dataValues.status)));


// admins	postgres		
// admins_roles	postgres		
// blocked_dates	postgres		
// blocked_times	postgres		
// categories	postgres		
// default_district_timeslots	postgres		
// district_settings	postgres		
// district_timeslots	postgres		
// district_workers	postgres		
// districts	postgres		
// factories	postgres		
// invalid_date_times	postgres		
// invalid_dates	postgres		
// invalid_times	postgres		
// items	postgres		
// laundry_types	postgres		
// oauth_access_grants	postgres		
// oauth_access_tokens	postgres		
// oauth_applications	postgres		
// order_details	postgres		
// order_histories	postgres		
// order_images	postgres		
// order_slots	postgres		
// order_sources	postgres		
// order_statuses	postgres		
// order_times	postgres		
// order_transactions	postgres		
// orders	postgres		
// permissions	postgres		
// permissions_roles	postgres		
// promo_codes	postgres		
// promos	postgres		
// promotion_banners	postgres		
// promotions	postgres		
// ranks	postgres		
// recurring_orders	postgres		
// roles	postgres		
// schema_migrations	postgres		
// sms_templates	postgres		
// spatial_ref_sys	rdsadmin		
// sub_categories	postgres		
// support_cases	postgres		
// support_categories	postgres		
// support_sub_categories	postgres		
// text_contents	postgres		
// user_addresses	postgres		
// user_credit_cards	postgres		
// user_credit_transactions	postgres		
// user_credits	postgres		
// user_feedbacks	postgres		
// user_promos	postgres		
// user_referral_codes	postgres		
// user_vouchers	postgres		
// users	postgres		
// vouchers	postgres		
// worker_roles	postgres		
// workers	postgres