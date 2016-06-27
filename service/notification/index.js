export * from './sms';

import moment from 'moment';

export function generateOTP() {
	return {
		otp: Math.floor(100000 + Math.random() * 900000),
		expire: moment().add(10, 'm').toDate()
	};
}